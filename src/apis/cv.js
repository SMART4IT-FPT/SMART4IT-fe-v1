import apiHelper from "../utils/apiHelper";
import { apiUrls } from "../utils/constants";
import appStrings from "../utils/strings";

export async function getCVsApi({ projectId, positionId, onFail, onSuccess }) {
  // Get CVs
  const response = await apiHelper.get(apiUrls.getCVs(projectId, positionId));
  // Handle response
  if (response.msg) {
    console.log(response.msg);
    if (response.data) {
      onSuccess(response.data);
    } else {
      onFail(appStrings.language.utils.noDataFound);
    }
  } else {
    onFail(response.detail);
  }
}

export async function getCVDetailApi({
  projectId,
  positionId,
  cvId,
  onFail,
  onSuccess,
}) {
  // Get CV detail
  const response = await apiHelper.get(
    apiUrls.getCV(projectId, positionId, cvId)
  );
  // Handle response
  if (response.msg) {
    console.log(response.msg);
    if (response.data) {
      onSuccess(response.data);
    } else {
      onFail(appStrings.language.utils.noDataFound);
    }
  } else {
    onFail(response.detail);
  }
}

export async function uploadCVDataApi({
  projectId,
  positionId,
  files,
  weights,  // Thêm weights vào tham số hàm
  onFail,
  onSuccess,
}) {
  // Tạo đối tượng FormData
  const formData = new FormData();
  
  // Thêm các file vào formData
  files.forEach((file) => {
    formData.append("cvs", file);
  });

  // Thêm weights vào formData dưới dạng JSON string
  formData.append("weight", JSON.stringify(weights));

  // Log FormData trước khi gửi yêu cầu POST
  console.log("FormData trước khi gửi:", formData);
  for (let [key, value] of formData.entries()) {
    console.log(key, value); // Log từng phần tử trong FormData
  }

  try {
    // Gửi yêu cầu POST với formData
    const response = await apiHelper.postFormData(
      apiUrls.uploadCV(projectId, positionId),
      formData
    );

    // Log phản hồi từ API
    console.log("Phản hồi từ API:", response);

    // Xử lý phản hồi từ API
    if (response.msg) {
      console.log(response.msg);
      if (response.data) {
        onSuccess(response.data);
      } else {
        onFail(appStrings.language.utils.noDataFound);
      }
    } else {
      onFail(response.detail);
    }
  } catch (error) {
    // Log lỗi nếu có
    console.error("Lỗi khi gửi yêu cầu:", error);
    onFail("Lỗi khi gửi yêu cầu");
  }
}



export async function uploadCVDataPublicApi({
  positionId,
  file,
  onFail,
  onSuccess,
}) {
  // Create a FormData object
  const formData = new FormData();
  formData.append("cv", file);
  // Send the request
  const response = await apiHelper.postFormData(
    apiUrls.uploadCVPublic(positionId),
    formData
  );
  // Handle response
  if (response.msg) {
    console.log(response.msg);
    onSuccess(response.data);
  } else {
    onFail(response.detail);
  }
}

export async function watchUploadProgressApi(progressId) {
  const response = await apiHelper.get(apiUrls.watchUploadProgress(progressId));
  console.log(response.msg);
  if (response.data) {
    return response.data;
  } else {
    return null;
  }
}

export async function downloadCVDataControl({
  projectId,
  positionId,
  cvId,
  onFail,
  onSuccess,
}) {
  const response = await apiHelper.get(
    apiUrls.downloadCV(projectId, positionId, cvId)
  );
  // Handle response
  if (response.msg) {
    console.log(response.msg);
    if (response.data) {
      onSuccess(response.data);
    } else {
      onFail(appStrings.language.utils.noDataFound);
    }
  } else {
    onFail(response.detail);
  }
}

export async function deleteCVDataApi({
  projectId,
  positionId,
  cvId,
  onFail,
  onSuccess,
}) {
  const response = await apiHelper.delete(
    apiUrls.deleteCV(projectId, positionId, cvId)
  );
  // Handle response
  if (response.msg) {
    console.log(response.msg);
    onSuccess(response.data);
  } else {
    onFail(response.detail);
  }
}


export async function getCVKeywordDetailApi({
  projectId,
  positionId,
  cvId,
  onFail,
  onSuccess,
}) {
  const response = await apiHelper.get(
    apiUrls.detailCV(projectId, positionId, cvId)
  );
  // Handle response
  if (response.msg) {
    console.log(response.msg);
    if (response.data) {
      onSuccess(response.data);
    } else {
      onFail(appStrings.language.utils.noDataFound);
    }
  } else {
    onFail(response.detail);
  }
}
