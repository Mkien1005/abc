import React, { useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormFeedback,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import { DocsComponents, DocsExample } from "src/components";

const CustomStyles = () => {
  const [validated, setValidated] = useState(false);
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  };
  return (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <CCol md={4}>
        <CFormLabel htmlFor="validationCustom01">Email</CFormLabel>
        <CFormInput
          type="text"
          id="validationCustom01"
          defaultValue="Mark"
          required
        />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={4}>
        <CFormLabel htmlFor="validationCustom02">Email</CFormLabel>
        <CFormInput
          type="text"
          id="validationCustom02"
          defaultValue="Otto"
          required
        />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={4}>
        <CFormLabel htmlFor="validationCustomUsername">Username</CFormLabel>
        <CInputGroup className="has-validation">
          <CInputGroupText id="inputGroupPrepend">@</CInputGroupText>
          <CFormInput
            type="text"
            id="validationCustomUsername"
            defaultValue=""
            aria-describedby="inputGroupPrepend"
            required
          />
          <CFormFeedback invalid>Please choose a username.</CFormFeedback>
        </CInputGroup>
      </CCol>
      <CCol md={6}>
        <CFormLabel htmlFor="validationCustom03">City</CFormLabel>
        <CFormInput type="text" id="validationCustom03" required />
        <CFormFeedback invalid>Please provide a valid city.</CFormFeedback>
      </CCol>
      <CCol md={3}>
        <CFormLabel htmlFor="validationCustom04">City</CFormLabel>
        <CFormSelect id="validationCustom04">
          <option disabled>Choose...</option>
          <option>...</option>
        </CFormSelect>
        <CFormFeedback invalid>Please provide a valid city.</CFormFeedback>
      </CCol>
      <CCol md={3}>
        <CFormLabel htmlFor="validationCustom05">City</CFormLabel>
        <CFormInput type="text" id="validationCustom05" required />
        <CFormFeedback invalid>Please provide a valid zip.</CFormFeedback>
      </CCol>
      <CCol xs={12}>
        <CFormCheck
          type="checkbox"
          id="invalidCheck"
          label="Agree to terms and conditions"
          required
        />
        <CFormFeedback invalid>You must agree before submitting.</CFormFeedback>
      </CCol>
      <CCol xs={12}>
        <CButton color="primary" type="submit">
          Submit form
        </CButton>
      </CCol>
    </CForm>
  );
};

const BrowserDefaults = () => {
  const [validated, setValidated] = useState(false);
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  };
  return (
    <CForm
      className="row g-3 needs-validation"
      validated={validated}
      onSubmit={handleSubmit}
    >
      <CCol md={4}>
        <CFormLabel htmlFor="validationDefault01">Email</CFormLabel>
        <CFormInput
          type="text"
          id="validationDefault01"
          defaultValue="Mark"
          required
        />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={4}>
        <CFormLabel htmlFor="validationDefault02">Email</CFormLabel>
        <CFormInput
          type="text"
          id="validationDefault02"
          defaultValue="Otto"
          required
        />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={4}>
        <CFormLabel htmlFor="validationDefaultUsername">Username</CFormLabel>
        <CInputGroup className="has-validation">
          <CInputGroupText id="inputGroupPrepend02">@</CInputGroupText>
          <CFormInput
            type="text"
            id="validationDefaultUsername"
            defaultValue=""
            aria-describedby="inputGroupPrepend02"
            required
          />
          <CFormFeedback invalid>Please choose a username.</CFormFeedback>
        </CInputGroup>
      </CCol>
      <CCol md={6}>
        <CFormLabel htmlFor="validationDefault03">City</CFormLabel>
        <CFormInput type="text" id="validationDefault03" required />
        <CFormFeedback invalid>Please provide a valid city.</CFormFeedback>
      </CCol>
      <CCol md={3}>
        <CFormLabel htmlFor="validationDefault04">City</CFormLabel>
        <CFormSelect id="validationDefault04">
          <option disabled>Choose...</option>
          <option>...</option>
        </CFormSelect>
        <CFormFeedback invalid>Please provide a valid city.</CFormFeedback>
      </CCol>
      <CCol md={3}>
        <CFormLabel htmlFor="validationDefault05">City</CFormLabel>
        <CFormInput type="text" id="validationDefault05" required />
        <CFormFeedback invalid>Please provide a valid zip.</CFormFeedback>
      </CCol>
      <CCol xs={12}>
        <CFormCheck
          type="checkbox"
          id="invalidCheck"
          label="Agree to terms and conditions"
          required
        />
        <CFormFeedback invalid>You must agree before submitting.</CFormFeedback>
      </CCol>
      <CCol xs={12}>
        <CButton color="primary" type="submit">
          Submit form
        </CButton>
      </CCol>
    </CForm>
  );
};

const Tooltips = () => {
  const [validated, setValidated] = useState(false);
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  };
  return (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <CCol md={4} className="position-relative">
        <CFormLabel htmlFor="validationTooltip01">Email</CFormLabel>
        <CFormInput
          type="text"
          id="validationTooltip01"
          defaultValue="Mark"
          required
        />
        <CFormFeedback tooltip valid>
          Looks good!
        </CFormFeedback>
      </CCol>
      <CCol md={4} className="position-relative">
        <CFormLabel htmlFor="validationTooltip02">Email</CFormLabel>
        <CFormInput
          type="text"
          id="validationTooltip02"
          defaultValue="Otto"
          required
        />
        <CFormFeedback tooltip valid>
          Looks good!
        </CFormFeedback>
      </CCol>
      <CCol md={4} className="position-relative">
        <CFormLabel htmlFor="validationTooltipUsername">Username</CFormLabel>
        <CInputGroup className="has-validation">
          <CInputGroupText id="inputGroupPrepend">@</CInputGroupText>
          <CFormInput
            type="text"
            id="validationTooltipUsername"
            defaultValue=""
            aria-describedby="inputGroupPrepend"
            required
          />
          <CFormFeedback tooltip invalid>
            Please choose a username.
          </CFormFeedback>
        </CInputGroup>
      </CCol>
      <CCol md={6} className="position-relative">
        <CFormLabel htmlFor="validationTooltip03">City</CFormLabel>
        <CFormInput type="text" id="validationTooltip03" required />
        <CFormFeedback tooltip invalid>
          Please provide a valid city.
        </CFormFeedback>
      </CCol>
      <CCol md={3} className="position-relative">
        <CFormLabel htmlFor="validationTooltip04">City</CFormLabel>
        <CFormSelect id="validationTooltip04" required>
          <option disabled defaultValue="">
            Choose...
          </option>
          <option>...</option>
        </CFormSelect>
        <CFormFeedback tooltip invalid>
          Please provide a valid city.
        </CFormFeedback>
      </CCol>
      <CCol md={3} className="position-relative">
        <CFormLabel htmlFor="validationTooltip05">City</CFormLabel>
        <CFormInput type="text" id="validationTooltip05" required />
        <CFormFeedback tooltip invalid>
          Please provide a valid zip.
        </CFormFeedback>
      </CCol>
      <CCol xs={12} className="position-relative">
        <CButton color="primary" type="submit">
          Submit form
        </CButton>
      </CCol>
    </CForm>
  );
};

const Validation = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <DocsComponents href="forms/validation/" />
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Xác thực</strong> <small>Mặc định của trình duyệt</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">
              Không muốn tùy chỉnh thông báo xác thực hoặc viết JavaScript để thay đổi hành vi form? Không sao, bạn có thể sử dụng mặc định của trình duyệt. Hãy thử gửi form bên dưới. Tùy thuộc vào trình duyệt và hệ điều hành của bạn, bạn sẽ thấy một kiểu phản hồi hơi khác một chút.
            </p>
            <p className="text-body-secondary small">
              Mặc dù các kiểu phản hồi này không thể được tùy chỉnh bằng CSS, bạn vẫn có thể tùy chỉnh văn bản phản hồi thông qua JavaScript.
            </p>
            <DocsExample href="forms/validation#browser-defaults">
              {BrowserDefaults()}
            </DocsExample>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Xác thực</strong> <small>Phía máy chủ</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">
              Chúng tôi khuyến nghị sử dụng xác thực phía máy khách, nhưng trong trường hợp bạn cần xác thực phía máy chủ, bạn có thể chỉ định các trường form không hợp lệ và hợp lệ bằng các thuộc tính boolean <code>invalid</code> và <code>valid</code>.
            </p>
            <p className="text-body-secondary small">
              Đối với các trường không hợp lệ, hãy đảm bảo rằng thông báo phản hồi/lỗi không hợp lệ được liên kết với trường form tương ứng bằng cách sử dụng <code>aria-describedby</code> (lưu ý rằng thuộc tính này cho phép tham chiếu nhiều <code>id</code>, trong trường hợp trường đã trỏ đến văn bản form bổ sung).
            </p>
            <DocsExample href="forms/validation#server-side">
              <CForm className="row g-3 needs-validation">
                <CCol md={4}>
                  <CFormLabel htmlFor="validationServer01">Email</CFormLabel>
                  <CFormInput
                    type="text"
                    id="validationServer01"
                    defaultValue="Mark"
                    valid
                    required
                  />
                  <CFormFeedback valid>Looks good!</CFormFeedback>
                </CCol>
                <CCol md={4}>
                  <CFormLabel htmlFor="validationServer02">Email</CFormLabel>
                  <CFormInput
                    type="text"
                    id="validationServer02"
                    defaultValue="Otto"
                    valid
                    required
                  />
                  <CFormFeedback valid>Looks good!</CFormFeedback>
                </CCol>
                <CCol md={4}>
                  <CFormLabel htmlFor="validationServerUsername">
                    Username
                  </CFormLabel>
                  <CInputGroup className="has-validation">
                    <CInputGroupText id="inputGroupPrepend03">
                      @
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      id="validationServerUsername"
                      defaultValue=""
                      aria-describedby="inputGroupPrepend03"
                      invalid
                      required
                    />
                    <CFormFeedback invalid>
                      Please choose a username.
                    </CFormFeedback>
                  </CInputGroup>
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="validationServer03">City</CFormLabel>
                  <CFormInput
                    type="text"
                    id="validationServer03"
                    invalid
                    required
                  />
                  <CFormFeedback invalid>
                    Please provide a valid city.
                  </CFormFeedback>
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="validationServer04">City</CFormLabel>
                  <CFormSelect id="validationServer04" invalid>
                    <option disabled>Choose...</option>
                    <option>...</option>
                  </CFormSelect>
                  <CFormFeedback invalid>
                    Please provide a valid city.
                  </CFormFeedback>
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="validationServer05">City</CFormLabel>
                  <CFormInput
                    type="text"
                    id="validationServer05"
                    invalid
                    required
                  />
                  <CFormFeedback invalid>
                    Please provide a valid zip.
                  </CFormFeedback>
                </CCol>
                <CCol xs={12}>
                  <CFormCheck
                    type="checkbox"
                    id="invalidCheck"
                    label="Agree to terms and conditions"
                    invalid
                    required
                  />
                  <CFormFeedback invalid>
                    You must agree before submitting.
                  </CFormFeedback>
                </CCol>
                <CCol xs={12}>
                  <CButton color="primary" type="submit">
                    Submit form
                  </CButton>
                </CCol>
              </CForm>
            </DocsExample>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Xác thực</strong> <small>Các phần tử được hỗ trợ</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">
              Ví dụ sau đây cho thấy các phần tử form được hỗ trợ và các lớp CSS tùy chỉnh. Các phần tử được yêu cầu có <code>aria-required="true"</code> vì điều này đảm bảo rằng người dùng công nghệ hỗ trợ (như trình đọc màn hình) hiểu rằng trường này là bắt buộc.
            </p>
            <DocsExample href="forms/validation#supported-elements">
              <CForm validated={true}>
                <div className="mb-3">
                  <CFormLabel
                    htmlFor="validationTextarea"
                    className="form-label"
                  >
                    Textarea
                  </CFormLabel>
                  <CFormTextarea
                    id="validationTextarea"
                    placeholder="Required example textarea"
                    invalid
                    required
                  ></CFormTextarea>
                  <CFormFeedback invalid>
                    Please enter a message in the textarea.
                  </CFormFeedback>
                </div>
                <CFormCheck
                  className="mb-3"
                  id="validationFormCheck1"
                  label="Check this checkbox"
                  required
                />
                <CFormFeedback invalid>
                  Example invalid feedback text
                </CFormFeedback>

                <CFormCheck
                  type="radio"
                  name="radio-stacked"
                  id="validationFormCheck2"
                  label="Check this checkbox"
                  required
                />

                <CFormCheck
                  className="mb-3"
                  type="radio"
                  name="radio-stacked"
                  id="validationFormCheck3"
                  label="Or toggle this other radio"
                  required
                />
                <CFormFeedback invalid>
                  More example invalid feedback text
                </CFormFeedback>

                <div className="mb-3">
                  <CFormSelect required aria-label="select example">
                    <option>Open this select menu</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </CFormSelect>
                  <CFormFeedback invalid>
                    Example invalid select feedback
                  </CFormFeedback>
                </div>

                <div className="mb-3">
                  <CFormInput
                    type="file"
                    id="validationTextarea"
                    aria-label="file example"
                    required
                  />
                  <CFormFeedback invalid>
                    Example invalid form file feedback
                  </CFormFeedback>
                </div>

                <div className="mb-3">
                  <CButton type="submit" color="primary" disabled>
                    Submit form
                  </CButton>
                </div>
              </CForm>
            </DocsExample>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Xác thực</strong> <small>Tooltips</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">
              Nếu form của bạn cho phép người dùng nhập dữ liệu không hợp lệ, bạn có thể muốn hiển thị thông báo lỗi trong một tooltip. Để làm điều này, hãy thêm <code>tooltip</code> vào các lớp phản hồi của bạn.
            </p>
            <DocsExample href="forms/validation#tooltips">{Tooltips()}</DocsExample>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Validation;
