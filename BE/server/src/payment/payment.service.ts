import { Injectable } from '@nestjs/common';
import * as qs from 'qs';
import * as crypto from 'crypto';
import { CreatePaymentDto } from './payment.dto';
import * as moment from 'moment';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  constructor(private config: ConfigService) {}
  async createPayment(req: any, createPaymentDto: CreatePaymentDto) {
    process.env.TZ = 'Asia/Ho_Chi_Minh';

    const { amount, bankCode, orderType, locale } = createPaymentDto; // Lấy từ DTO

    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');

    let ipAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let tmnCode = this.config.get('VNP_TMN_CODE');
    let secretKey = this.config.get('VNP_HASH_SECRET');
    let vnpUrl = this.config.get('VNP_URL');
    let returnUrl = this.config.get('VNP_RETURN_URL');
    let orderId = moment(date).format('DDHHmmss');

    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale ? locale : 'vn';
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = orderType || 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode) {
      vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = this.sortObject(vnp_Params);

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac('sha512', secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    return { code: '00', data: vnpUrl };
  }

  async vnpayReturn(query: any) {
    const vnp_HashSecret = process.env.VNP_HASH_SECRET;
    const secureHash = query.vnp_SecureHash;

    delete query.vnp_SecureHash;
    delete query.vnp_SecureHashType;

    const sortedParams = Object.keys(query)
      .sort()
      .reduce((result, key) => {
        result[key] = query[key];
        return result;
      }, {});

    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
    const checkSum = hmac.update(signData).digest('hex');

    if (secureHash === checkSum) {
      return {
        success: true,
        message: 'Payment verified successfully',
        data: query,
      };
    } else {
      return { success: false, message: 'Payment verification failed' };
    }
  }
  private sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
  }
}
