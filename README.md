<div align="center">

<img src="https://img.shields.io/badge/AWS_Lambda-FF9900?style=for-the-badge&logo=awslambda&logoColor=white"/>
<img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
<img src="https://img.shields.io/badge/Amazon_S3-FF9900?style=for-the-badge&logo=amazons3&logoColor=white"/>

# ⚡ LinkUp — S3 Upload Lambda

**Auto-updates MongoDB when a file is uploaded to S3**

![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

> Part of the [🔗 LinkUp Social Media Backend](https://github.com/hazzem-web/LinkUp-SocialMedia)

</div>

---

## 📖 About

This AWS Lambda function is triggered automatically whenever a file is uploaded to the **LinkUp S3 bucket**.

Instead of the main server handling file uploads and updating the database manually, this Lambda listens to S3 events and **auto-updates the user's profile in MongoDB** — keeping the main server clean and lightweight.

---

## 🔄 How It Works

```
┌─────────────┐     Presigned URL      ┌─────────────┐
│             │ ─────────────────────► │             │
│   Client    │   Upload file directly  │   AWS S3    │
│             │ ─────────────────────► │   Bucket    │
└─────────────┘                        └──────┬──────┘
                                              │
                                    S3 Event Trigger
                                              │
                                              ▼
                                       ┌─────────────┐
                                       │    AWS      │
                                       │   Lambda    │
                                       └──────┬──────┘
                                              │
                                     Parse S3 Key
                                     Extract userId
                                     attachmentType
                                              │
                                              ▼
                                       ┌─────────────┐
                                       │   MongoDB   │
                                       │  updateOne  │
                                       │  profilePic │
                                       └─────────────┘
```

---

## 🗂️ S3 Key Structure

The Lambda expects the uploaded file key to follow this structure:

```
linkup / {env} / users / {userId} / {attachmentType} / {fileName}
  [0]    [1]      [2]      [3]           [4]              [5]
```

**Example:**
```
linkup/prod/users/64f1a2b3c4d5e6f7a8b9c0d1/profile-pic/photo.jpg
```

| Part | Value | Description |
|---|---|---|
| `parts[3]` | `64f1a2b3...` | MongoDB User `_id` |
| `parts[4]` | `profile-pic` | Attachment type |
| `parts[5]` | `photo.jpg` | File name |

---

## ⚙️ Environment Variables

```env
MONGO_URI=mongodb+srv://your-connection-string
DB_NAME=linkup
COLLECTION_NAME=users
```

---

## 🚀 Deploy

1. Install dependencies:
```bash
npm install
```

2. Zip the function:
```bash
zip -r lambda.zip .
```

3. Upload to AWS Lambda and set the S3 trigger on your bucket.

---

## 🔗 Related Project

This Lambda is part of the **LinkUp** social networking platform.

👉 [LinkUp Social Media Backend](https://github.com/hazzem-web/LinkUp-SocialMedia)

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/hazzem-web">Hazzem</a></sub>
</div>