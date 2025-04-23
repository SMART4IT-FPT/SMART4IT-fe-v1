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
  weights,
  llmName, // ✅ thêm dòng này
  onFail,
  onSuccess,
}) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("cvs", file);
  });

  formData.append("weight", JSON.stringify(weights));

  if (llmName) {
    formData.append("llm_name", llmName);
  }

  try {
    const response = await apiHelper.postFormData(
      apiUrls.uploadCV(projectId, positionId),
      formData
    );

    if (response.msg) {
      if (response.data) {
        onSuccess(response.data);
      } else {
        onFail(appStrings.language.utils.noDataFound);
      }
    } else {
      onFail(response.detail);
    }
  } catch (error) {
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

export async function rematchCVDataApi({
  projectId,
  positionId,
  weights,
  llmName,
  onFail,
  onSuccess,
}) {
  try {
    const formData = new FormData();
    formData.append("llm_name", llmName);
    formData.append("weight", JSON.stringify(weights)); // cần stringify!

    const response = await apiHelper.postFormData(
      apiUrls.rematchCVs(projectId, positionId),
      formData
    );

    if (response.msg) {
      onSuccess(response.data);
    } else {
      onFail(response.detail || "Rematch failed");
    }
  } catch (error) {
    console.error("Lỗi khi gửi yêu cầu rematch:", error);
    onFail("Lỗi khi gửi yêu cầu rematch");
  }
}
