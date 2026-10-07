import { MongoClient, ObjectId } from "mongodb";
import { configDotenv } from "dotenv";
configDotenv();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;
const COLLECTION_NAME = process.env.COLLECTION_NAME;

let client;

const connectDB = async ()=>{ 
    if (!client){
        client = new MongoClient(MONGO_URI);
        await client.connect();
    }
    return client;
}


export const handler = async (event)=> {
    const client = await connectDB();
    const db = client.db(DB_NAME);
    const users = db.collection(COLLECTION_NAME);
    for (const record of event.Records) { 
        try {
            let fullKey = decodeURIComponent(
                record.s3.object.key.replace(/\+/g, " ")
            );
            console.log("S3 Key: ", fullKey)
            const parts = fullKey.split("/");

            console.log(parts);

            const customId = parts[4];
            const attachmentType = parts[5];
            const fileName = parts[6];

            if (!customId || !attachmentType|| !fileName) { 
                console.log("Invalid Key Format: ", fullKey);
                continue;
            }

            console.log({ fullKey });

            const result = await users.updateOne( 
                {_id: new ObjectId(customId)},
                {
                    $set: {
                        profilePic: `/uploads/${fullKey}`,
                        updatedAt: new Date()
                    }
                }
            );

            console.log({
                customId,
                attachmentType,
                matched: result.matchedCount,
                modified: result.modifiedCount
            })

        } catch (err) {
            console.error("Lambda Error for Record: ", err);
        }
        return {statusCode: 200}
    }
}


// await handler({
//     Records: [
//         {
//             s3: {
//                 object: {
//                     key: ""
//                 }
//             }
//         }
//     ]
// })






/*  after uploading this function we will stop 

userData.profilePic = key as string;
await userData.save();


and

await s3Service.deleteAsset({
    Key: userData.profilePic
})

(update and delete presign url key) 

in updateProfile function in main project as it's useless after setting a lambda function
*/