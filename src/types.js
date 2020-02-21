export const userActionTypes = {
  TOKEN_VERIFIED: 'TOKEN_VERIFIED',
  VERIFY_TOKEN_FAILED: 'VERIFY_TOKEN_FAILED',
  LOGGEDIN: 'LOGGEDIN',
  LOGGEDOUT: 'LOGGEDOUT',
  SIGNEDUP: 'SIGNEDUP',
  BOARD_ADDED: 'BOARD_ADDED',
  EMAIL_CONFIRMED: 'EMAIL_CONFIRMED',
  RESET_PASSWORD: 'RESET_PASSWORD',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  FORGOT_PASSWORD_FAILED: 'FORGOT_PASSWORD_FAILED',
  RESET_PASSWORD_FAILED: 'RESET_PASSWORD_FAILED',
  LOGGEDOUT_FAILED: 'LOGGEDOUT_FAILED',
  SIGNINGUP_FAILED: 'SIGNINGUP_FAILED',
  LOGGING_FAILED: 'LOGGING_FAILED',
  EMAIL_CONFIRMATION_FAILED: 'EMAIL_CONFIRMATION_FAILED',
  ALL_BOARDS_DOWNLOADED: 'ALL_BOARDS_DOWNLOADED',
  ALL_BOARDS_DOWNLOADING_FAILED: 'ALL_BOARDS_DOWNLOADING_FAILED',
  BOARD_TITLE_UPDATED: 'BOARD_TITLE_UPDATED',
  BOARD_DELETED: 'BOARD_DELETED',
  BOARD_DELETE_FAILED: 'BOARD_DELETE_FAILED',
  BOARD_REMOVED: 'USER_BOARD_REMOVED',
  BOARD_REMOVE_FAILED: 'USER_BOARD_REMOVE_FAILED',
};

export const boardActionTypes = {
  CREATED: 'CREATED',
  CREATE_FAILED: 'CREATE_FAILED',
  BOARD_DOWNLOADED: 'BOARD_DOWNLOADED',
  BOARD_DOWNLOAD_FAILED: 'BOARD_DOWNLOAD_FAILED',
  BOARD_UPDATED: 'BOARD_UPDATED',
  BOARD_UPDATE_FAILED: 'BOARD_UPDATE_FAILED',
  BOARD_USERS_FOUND: 'BOARD_USERS_FOUND',
  BOARD_FIND_USERS_FAILED: 'BOARD_FIND_USERS_FAILED',
  BOARD_MEMBER_ADDED: 'BOARD_MEMBER_ADDED',
  BOARD_MEMBER_ADD_FAILED: 'BOARD_MEMBER_ADD_FAILED',
  BOARD_MEMBERS_RECEIVED: 'BOARD_MEMBERS_RECEIVED',
  BOARD_MEMBERS_RECEIVE_FAILED: 'BOARD_MEMBERS_RECEIVE_FAILED',
  BOARD_MEMBER_REMOVED: 'BOARD_MEMBER_REMOVED',
  BOARD_MEMBER_REMOVE_FAILED: 'BOARD_MEMBER_REMOVE_FAILED',
  CLEAR_BOARD_DATA: 'CLEAR_BOARD_DATA',
  ACTIVITIES_LOADED: 'ACTIVITIES_LOADED',
  ACTIVITIES_LOADING_FAILED: 'ACTIVITIES_LOADING_FAILED',
  CLEAN_ACTIVITIES: 'CLEAN_ACTIVITIES',
  LABEL_UPDATED: 'LABEL_UPDATED',
  LABEL_UPDATE_FAILED: 'LABEL_UPDATE_FAILED',
  BOARD_REMOVED: 'BOARD_REMOVED',
  BOARD_REMOVE_FAILED: 'BOARD_REMOVE_FAILED',
};

export const columnActionTypes = {
  COLUMN_POSITIONS_SWITCHED: 'COLUMN_POSITIONS_SWITCHED',
  COLUMN_CREATED: 'COLUMN_CREATED',
  COLUMN_CREATE_FAILED: 'COLUMN_CREATE_FAILED',
  COLUMN_DELETED: 'COLUMN_DELETED',
  COLUMN_DELETE_FAILED: 'COLUMN_DELETE_FAILED',
  COLUMN_UPDATED: 'COLUMN_UPDATED',
  COLUMN_UPDATE_FAILED: 'COLUMN_UPDATE_FAILED',
  COLUMN_POSITIONS_UPDATED: 'COLUMN_POSITIONS_UPDATED',
  COLUMN_POSITIONS_UPDATE_FAILED: 'COLUMN_POSITIONS_UPDATE_FAILED',
};

export const cardActionTypes = {
  CARD_POSITIONS_SWITCHED: 'CARD_POSITIONS_SWITCHED',
  CARD_CREATED: 'CARD_CREATED',
  CARD_CREATE_FAILED: 'CARD_CREATE_FAILED',
  CARD_DELETED: 'CARD_DELETED',
  CARD_DELETE_FAILED: 'CARD_DELETE_FAILED',
  CARD_UPDATED: 'CARD_UPDATED',
  CARD_UPDATE_FAILED: 'CARD_UPDATE_FAILED',
  CARD_POSITIONS_UPDATED: 'CARD_POSITIONS_UPDATED',
  CARD_POSITIONS_UPDATE_FAILED: 'CARD_POSITIONS_UPDATE_FAILED',
  CARD_COMMENT_ADDED: 'CARD_COMMENT_ADDED',
  CARD_COMMENT_ADD_FALIED: 'CARD_COMMENT_ADD_FALIED',
  CARD_COMMENT_UPDATED: 'CARD_COMMENT_UPDATED',
  CARD_COMMENT_UPDATE_FALIED: 'CARD_COMMENT_UPDATE_FALIED',
  CARD_COMMENT_DELETED: 'CARD_COMMENT_DELETED',
  CARD_COMMENT_DELETE_FALIED: 'CARD_COMMENT_DELETE_FALIED',
  LABEL_ATTACHED: 'LABEL_ATTACHED',
  LABEL_ATTACH_FAILED: 'LABEL_ATTACH_FAILED',
  LABEL_REMOVED: 'LABEL_REMOVED',
  LABEL_REMOVE_FAILED: 'LABEL_REMOVE_FAILED',
  CARD_LOCAL_CHANGES_UPDATED: 'CARD_LOCAL_CHANGES_UPDATED',
  CARD_LOCAL_CHANGES_UPDATE_FAILED: 'CARD_LOCAL_CHANGES_UPDATE_FAILED',
};

export const formActionTypes = {
  LOGIN: 'LOGIN',
  SIGNUP: 'SIGNUP',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
};
