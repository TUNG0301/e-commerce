import Commerce from '@chec/commerce.js'

export const commerce = new Commerce(process.env.REACT_APP_CHEC_PUBLIC_KEY, true); //true means that this is going to create a new commerce store 
