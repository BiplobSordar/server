import { body ,check} from 'express-validator';
import postgres from 'postgres';
export const signInValidation = (method) => {





    switch (method) {
        case 'signUp': {
            return [
                body('userName').exists().withMessage('Username Missing').bail()
                    .isLength({ min: 3 }).withMessage('UserName must required 3 Char').trim(),
                body('email').isEmail().withMessage('Please provide a valid email').trim(),
                // .custom(async (value) => {
                //     const sql = postgres(`${process.env.DATABASE_URL}`)
                //     const users = await sql`select email from users where email=${value}`
                //     console.log(users)

                //     if (users.length > 0) {
                //         throw new Error('User Already Exists..')
                //     }

                // }),
                body('password').exists().withMessage('Username Missing').bail().isLength({ min: 8 }).withMessage('Password Must Be Greater Than Or Equal 8 Char'),




            ]
        }


        case 'signIn': {
            return [
                body('email').isEmail().withMessage('Please provide a valid email').trim(),
                body('password').exists().withMessage('Username Missing').bail().isLength({ min: 8 }).withMessage('Password Must Be Greater Than Or Equal 8 Char')
            ]

        }

    }



}

export const courseValidation = () => {
    return [
        check('title').exists().withMessage('Please Enter The Title').bail().notEmpty().withMessage('Please Enter The Title'),
        check('category').exists().withMessage('please Select The category').bail().notEmpty().withMessage('please Select The category')
    ]
}



