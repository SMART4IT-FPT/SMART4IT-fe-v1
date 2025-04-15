export function formatErrorResponse(error) {
  return {
    detail: `${error}`,
  };
}

export function getAliasByName(name, id) {
  return name.replace(/ /g, "-").toLowerCase() + "-" + id.slice(0, 5);
}

export function formatDate(isoString, withDateOfWeek = false) {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Đảm bảo tháng có 2 chữ số
  const day = String(date.getDate()).padStart(2, '0'); // Đảm bảo ngày có 2 chữ số
  const hours = String(date.getHours()).padStart(2, '0'); // Đảm bảo giờ có 2 chữ số
  const minutes = String(date.getMinutes()).padStart(2, '0'); // Đảm bảo phút có 2 chữ số
  
  // Trả về theo định dạng "yyyy-LL-dd HH:mm"
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}


export function removeWhiteSpace(str) {
  return str.replace(/\s/g, "");
}

// export function getScoreColor(score) {
//   if (score < 40) {
//     return "red";
//   } else if (score >= 80) {
//     return "green";
//   } else {
//     return "orange";
//   }
// }

export function getShareUploadUrl(id) {
  const baseUrl = window.location.origin;
  return `${baseUrl}/upload/${id}`;
}
