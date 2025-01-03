import postgres from "postgres"
import Stripe from "stripe";


export const getCourseByIdWithStatus = async (req, res) => {


    const sql = postgres(`${process.env.DATABASE_URL}`);



    const user_id = req.id
    const { course_id } = req.params



    try {



        const course = await sql`
       
                                SELECT
                                courses.*,
                                users.username AS instructor,
                                users.photo_url AS avatar,
                                purchase.status AS purchase_status,
                                JSON_AGG(
                                           JSON_BUILD_OBJECT(
                                               'lecture_id', lectures.id,
                                               'lecture_title', lectures.title,
                                               'lecture_url',lectures.videourl,
                                               'lecture_preview',lectures.ispreviewfree
                                                             )
                                         ) AS related_lectures
                                FROM 
                                    courses
                                INNER JOIN 
                                    users 
                                    ON 
                                        courses.authorid = users.id
                                LEFT JOIN 
                                    lectures 
                                    ON 
                                        courses.id = lectures.course_id
                                LEFT JOIN 
                                    purchase 
                                    ON 
                                        courses.id = purchase.course_id AND purchase.user_id = ${user_id}
                                WHERE 
                                    courses.id = ${course_id} 
                                GROUP BY 
                                    courses.id, users.id, purchase.status;
                                    `


        return res.status(200).json({ success: true, course: course[0] })
    } catch (error) {
        console.log(error, 'errro happend at purchase.js')
        return res.status(500).json({ success: false, message: "Internal Server Error at purchase.js" })
    }
}

export const createCheckoutSession = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const sql = postgres(`${process.env.DATABASE_URL}`);
    try {
        const user_id = req.id
        const { course_id } = req.body



        const course = await sql`select id,title, coursethumbnail ,courseprice from courses where id=${course_id}`

        if (!course[0]) return res.status(404).json({ message: "Course not found!" });
        const { id, title, coursethumbnail, courseprice } = course[0]
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: title,
                            images: [coursethumbnail]
                        },
                        unit_amount: courseprice
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:5173/course-progress/${course_id}`,
            cancel_url: `http://localhost:5173/courses/${course_id}/show_details`,
            metadata: {
                course_id: course_id,
                user_id: user_id
            },
            shipping_address_collection: {
                allowed_countries: ["IN"], // Optionally restrict allowed countries
            },
        });

        if (!session.url) {
            return res.status(400).json({
                success: false, message: 'Error While Createing payment Session'
            })
        }


        await sql`CREATE TABLE IF NOT EXISTS PURCHASE (
            id BIGSERIAL PRIMARY KEY,
            course_id INT NOT NULL,
            user_id INT NOT NULL,
            amount NUMERIC NOT null,
            status purchase_status NOT NULL,
            payment_id VARCHAR(200) NOT NULL,
            FOREIGN KEY (course_id) REFERENCES COURSES(id),
            FOREIGN KEY (user_id) REFERENCES USERS(id)

        )`

        await sql`INSERT INTO purchase (user_id,course_id,amount,payment_id,status)
                                        
                                        VALUES(${user_id},${course_id},${courseprice},${session.id},'pending')
                                                     `






        return res.status(200).json({
            success: true,
            url: session.url
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal Server Error at purchase.js" })

    }
}





export const stripeWebhook = async (req, res) => {
    const sql = postgres(`${process.env.DATABASE_URL}`);

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    let event;

    try {
        const payloadString = JSON.stringify(req.body, null, 2);
        const secret = process.env.STRIPE_WEBHOOK_SECRET;

        const header = stripe.webhooks.generateTestHeaderString({
            payload: payloadString,
            secret,
        });

        event = stripe.webhooks.constructEvent(payloadString, header, secret);
    } catch (error) {
        console.error("Webhook error:", error.message);
        return res.status(400).send(`Webhook error: ${error.message}`);
    }

    // Handle the checkout session completed event


    if (event.type === 'checkout.session.completed') {
        console.log('Checkout session completed event received');

        const session = event.data.object;

        try {
            const purchase = await sql`SELECT 1 FROM purchase WHERE payment_id = ${session.id}`;
            if (purchase.length === 0) {

                return res.status(404).json({ message: 'Purchase not found' });
            }

            // Update purchase status
            const result = await sql`UPDATE purchase 
                                      SET status = ${'complete'} 
                                      WHERE payment_id = ${session.id} 
                                      RETURNING *`;

            if (!result || result.length === 0) {
                return res.status(404).json({ message: 'Failed to update purchase' });
            }

            const { course_id, user_id } = result[0];

            // Insert into course progress
            const progress = await sql`INSERT INTO course_progress (user_id, course_id, completed) 
                                        VALUES (${user_id}, ${course_id}, ${false}) 
                                        RETURNING *`;


        } catch (error) {
            console.error('Error handling event:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    res.status(200).send();
}


export const getAllPurchasedCourse = async (req, res) => {
    const sql = postgres(`${process.env.DATABASE_URL}`);
    try {

        const purchasedCourses = await sql`SELECT 
        c.authorid AS author_id,
        COUNT(p.id) AS total_sales,
        COALESCE(SUM(p.amount), 0) AS total_revenue
    FROM 
        Courses c
    LEFT JOIN 
        Purchase p
    ON 
        c.id = p.course_id
    WHERE 
        c.authorid = ${req.id} AND p.status = 'complete' 
    GROUP BY 
        c.authorid;
     `
        console.log(purchasedCourses, 'thsis is the purchase course by ', req.id)
        if (purchasedCourses.length == 0) {
            return res.status(404).json({
                purchasedCourse: [],
            });
        }
        return res.status(200).json({
            result: purchasedCourses[0]
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};
