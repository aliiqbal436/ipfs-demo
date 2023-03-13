import { UPLOAD_FILE } from "./actionTypes";
export const uploadFile = (file) => {  
  return {    
     type: UPLOAD_FILE,    
     payload: { file },  
 };
};
// export const decrementAction = (step) => {  
//   return {    
//      type: DECREMENT_REQUEST,    
//      payload: { step: step },  
//  };
// };