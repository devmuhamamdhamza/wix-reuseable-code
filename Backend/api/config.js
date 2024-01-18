
// export const headers = {
//   Accept: "application/json",
//   "Content-Type": "application/json",
// };
// export const formDataheaders = {
//   Accept: "application/json",
//   "Content-Type": "application/json",
// };

export const getHeaders = async (token, formData) => {
  const headers = {
    Accept: "application/json",
  };
  if (token) Object.assign(headers, { authorization: token });
  if (formData) {
    Object.assign(headers, { "Content-Type": "multipart/form-data" });
  } else {
    Object.assign(headers, { "Content-Type": "application/json" });
  }

  return headers;
};
