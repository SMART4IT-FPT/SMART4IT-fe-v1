import { rem } from "@mantine/core";

const english = {
  auth: {
    login: "Login to SMART4IT",
    logout: "Logout",
    noLogin: "You are not logged in",
  },
  btn: {
    cancel: "Cancel",
    delete: "Delete",
    share: "Share",
    create: "Create",
    back: "Back",
    save: "Save",
    edit: "Edit",
    drop: "Drop to upload",
    open: "Open",
    close: "Close",
    copy: "Copy",
    copied: "Copied",
    download: "Download",
    backToHome: "Back to home",
    ai: "AI Summary",
  },
  home: {
    title: "Home",
    welcome: "Welcome ",
    createBtn: "Create new project",
    recentProjects: "Recent Projects",
    sharedProjects: "Shared Projects",
  },
  yourProject: {
    title: "Projects",
    heading: "Your Projects",
    createBtn: "Create new project",
    searchPlaceholder: "Search project",
    deleteProjectSuccessMessage: "Your project has been deleted successfully",
  },
  createProject: {
    title: "Create new project",
    nameLabel: "Project Name",
    aliasLabel: "Project Alias",
    descriptionLabel: "Project Description",
  },
  sharedProjects: {
    title: "Shared",
    heading: "Shared with you",
    searchPlaceholder: "Search project",
  },
  trashProjects: {
    title: "Trash",
    heading: "Deleted Projects",
    restoreProjectBtn: "Restore",
    deletePermanentlyBtn: "Delete Permanently",
    restoreProjectSuccessMessage: "Your project has been restored successfully",
    deletePermanentlySuccessMessage:
      "Your project has been deleted permanently",
  },
  position: {
    title: "Position",
    heading: "Position",
    searchPlaceholder: "Search position",
    createBtn: "Create new position",
    activePositions: "Active Positions",
    closedPositions: "Closed Positions",
    closeSuccessMessage: "Your position has been closed successfully",
    openSuccessMessage: "Your position has been opened successfully",
    deleteSuccessMessage: "Your position has been deleted successfully",
    downloadSummary: "Download Cvs Summary",
    downloadSuccessMessage: "Your summary of CVs has been downloaded successfully",
  },
  insight: {
    title: "Insight",
    heading: "SMART4IT Insight",
    introduction:
      "SMART4IT Insight help you analyze detail about the recruitment position, about the distribution of skills among candidates' scores.",
    selectPlaceholder: "Select position",
    viewInsightBtn: "View Insight",
  },
  createPosition: {
    title: "Create new position",
    nameLabel: "Position Name",
    aliasLabel: "Position Alias",
    descriptionLabel: "Position Description",
    startDateLabel: "Start Date",
    endDateLabel: "End Date",
    criteriaSetLabel: "Criteria Set",
    requiredErrorMessage: "Please fill all required fields",
    fieldRequired: "This field is required",
  },
  setting: {
    title: "Setting",
    heading: "Setting",
    requiredRestart: "Required restart to apply changes",
    general: {
      title: "General",
      language: "Language",
      theme: "Theme",
    },
    member: {
      title: "Member",
      search: "Search member",
      add: "Add member",
      member: "Member",
      email: "Email",
      role: "Role",
      actions: "Actions",
      roles: {
        owner: "Owner",
        member: "Member",
      },
      searchPlaceholder: "Search member by email",
      removeAccessSuccess: "Member has been removed successfully",
    },
  },
  positionDetail: {
    title: "General",
    startDateLabel: "Start Date",
    endDateLabel: "End Date",
    criteriaTitle: "Criteria",
    createCriteriaBtn: "Add Criteria",
    criteriaNameLabel: "Criteria Name",
    criteriaPriorityLabel: "Priority",
    criteriaExampleLabel: "Example",
    createCriteriaSuccessMessage: "Your criteria has been created successfully",
    deleteCriteriaSuccessMessage: "Your criteria has been deleted successfully",
    updateCriteriaSuccessMessage: "Your criteria has been updated successfully",
    activeLabel: "Active",
    closedLabel: "Closed",
    overdueLabel: "Overdue",
    weightConfigureLabel: "Weight Configuration",
    education: "Education",
    language: "Language",
    technical: "Technical Skill",
    experience: "Work Experience",
    personalProject: "Personal Project",
    publication: "Publication",
    workExperienceDetail: "Work Experience Detail", 
    relevan: "Relevan",
    duration: "Duration",
    responsibilities: "Responsibilities",
    personalProjectDetail: "Personal Project Detail",
    technologies: "Technologies",   
  },
  cv: {
    title: "CVs",
    heading: "Your CVs",
    searchPlaceholder: "Search CV",
    showBtn: "Show score",
    rematchBtn: "Rematch",
    tableCVName: "CV Name",
    tableUploadDate: "Upload Date",
    tableScore: "Score",
    tableAction: "Action",
    showUploadZone: "Show Upload Zone",
    hideUploadZone: "Hide Upload Zone",
    shareUrlTitle: "Share this URL",
    shareUrlMessage: "Share this URL with your candidates",
    notScored: "Not scored",
    adjustLimit: "Limit",
    adjustThreshold: "Threshold",
    uploadSuccessTitle: "Upload success",
    uploadSuccessMessage: "Your CVs has been uploaded successfully",
    showSuccessTitle: "Show score success",
    rematchSuccessTitle: "Rematch success",
    rematchSuccessMessage: "Your CVs has been rematched successfully",
    showSuccessMessage: "Your CV score has been displayed successfully",
    fetchErrorMessage: "Error fetching CVs or scores",
    configureWeightMessage: "Please configure the weight first",
    noCriteriaError: "Please add criteria before uploading CV",
    noCVError: "Please upload CV before matching",
    uploadCVPublic: "Upload your CV here",
    limitExceeded: "You can only upload one CV at a time",
    thanksForUploading: "Thanks for uploading your CV",
    resubmitBtn: "Submit another CV",
    viewActionTooltip: "View Detail",
    deleteCVSuccessMessage: "Your CV has been deleted successfully",
    tableLabel: "Labels",
    tableComponentScore: "Components Score",
    tableOverallScore: "Overall Score",
    educationScore: "Education Score",
    languageScore: "Language Score",
    technicalScore: "Technical Score",
    experienceScore: "Experience Score",
    personalProjectScore: "Personal Project Score",
    publicationScore: "Publication Score",
    filter: "Filter by labels",
  },
  jd: {
    title: "JD",
    heading: "Job Description",
    uploadJDBtn: "Upload JD",
    uploadJDTitle: "Upload JD data here",
    uploadJDMessage: "Quick extraction from PDF or Word file",
    saveSuccess: "Your JD has been saved successfully",
    noCriteriaError: "Please add criteria before saving JD",
    noContentError: "Please add content before saving JD",
    showJD: "Show JD",
    hideJD: "Hide JD",
  },
  cvDetail: {
    overall: "Overall",
    criteriaInformation:
      "There are keywords and the score of the criteria.\n The keyword is the word that is extracted from the CV.\n The score is the level of the keyword analized in the CV.",
    stepApply: "Applying",
    stepAccept: "Accepted",
    stepInterview: "Interviewing",
    stepHire: "Hired",
    detailTable: "Keyword Detail",
  },
  matchingResult: {
    title: "Matching Result",
  },
  share: {
    title: "Share member",
    searchPlaceholder: "Typing email to search",
    shareProjectSuccessMessage: "Your project has been shared successfully",
  },
  questionBanks: {
    title: "Question Banks",
    heading: "Your Question Banks",
    searchPlaceholder: "Search question bank",
    tableName: "Question Bank Name",
    tableCount: "Total Questions",
    tableLevel: "Level",
    tableAction: "Actions",
    addBtn: "Add Question Bank",
    nameLabel: "Question Bank Name",
    deleteSuccessMessage: "Your question bank has been deleted successfully",
  },
  questionBankDetail: {
    searchPlaceholder: "Search question",
    addQuestionBtn: "Add Question",
    createBtn: "Add Question",
    totalQuestion: "Total question",
    questionContentLabel: "Question content",
    createQuestionSuccessMessage: "Your question has been created successfully",
    updateQuestionSuccessMessage: "Your question has been updated successfully",
    deleteQuestionSuccessMessage: "Your question has been deleted successfully",
  },
  utils: {
    emptyData: "No data available",
    noDataFound: "No data found in response",
    notFoundTitle: "404 Not Found",
    notFoundMessage: "The page you are looking for does not exist",
    unsupportFile: "Unsupported file type",
    theme: {
      light: "Light",
      dark: "Dark",
      system: "System",
    },
  },
  notification: {
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Info",
  },
  confirmModal: {
    title: "Are you sure?",
    message: "You can't undo this action afterwards",
    confirm: "Confirm",
    cancel: "Cancel",
  },
};

export default english;
