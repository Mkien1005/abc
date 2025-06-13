import Swal from "sweetalert2"


// icon: success, error, warning, info, question

export default class Alert {
    static notify = (title, des, icon) => {
       return Swal.fire({
        title: title,
        text: des,
        icon: icon
      });
    }
}