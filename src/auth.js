import { getData } from './dataStore'
import { setData } from './dataStore'
import validator from 'validator'

function authRegisterV1(email, password, nameFirst, nameLast) {

   let invalidFirstName = (nameFirst.length < 1 || nameFirst.length > 50)

   let invalidLastName = (nameLast.length < 1 || nameLast.length > 50)

   let invalidPassword = (password.length < 6)

   let invalidEmail = (validator.isEmail(email))

   if (invalidFirstName || invalidLastName || invalidPassword || invalidEmail) {
      return { error: 'One or more invalid inputs' }
   }

   let data = getData()
   let ifDataStoreEmpty = (data.users.length === 0);

   if (!ifDataStoreEmpty) {
      let registeredUser = data.users.find((user) => user.email === email)

      if (registeredUser) {
         return { error: 'Already registered' }
      }

   }

   let uId = data.users.length + 1;


   let handleStr = (nameFirst + nameLast).toLowerCase();
   handleStr = handleStr.replace(/\W/g, "");

   if (!ifDataStoreEmpty) {
      let existingHandle = data.users.find(user => user.handleStr.includes(handleStr));
      if (existingHandle) {
         existingHandle = existingHandle.handleStr;

         let endCharacter = existingHandle?.slice(-1);

         existingHandle = endCharacter && !isNaN(parseInt(endCharacter)) ?
            existingHandle.replace(/.$/, parseInt(endCharacter) + 1) :
            `${existingHandle || ''}0`;
         handleStr = existingHandle
      }
   }

   const newUser = {
      uId: uId,
      email: email,
      password: password,
      nameFirst: nameFirst,
      nameLast: nameLast,
      handleStr: handleStr,
   }


   data.users.push(newUser);


   setData(data)
   return { authUserId: uId };


}

function authLoginV1(email, password){
   let data = getData();
   if (data.users.length === 0){
      return {
         error: 'Email not found',
      }
   }
   let user = data.users.find(user => user.email === email);
   if (!user){
      return {
         error: 'Email not found',
      }
   }

   if (user.password !== password){
      return{
         error: 'Invalid password',
      }
   }
   return {
      authUserId: user.uId,
   }
}
export { authRegisterV1, authLoginV1 }

