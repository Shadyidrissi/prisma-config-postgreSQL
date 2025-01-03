const express = require('express');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config(); // تحميل متغيرات البيئة من .env

const prisma = new PrismaClient();
const app = express();
const port = 3000;

// Middleware لقراءة بيانات JSON من الطلب
app.use(express.json());

// API لجلب جميع المستخدمين
app.get('/all_users', async (req, res) => {
  try {
    const data = await prisma.user.findMany();
    console.log("Fetched all users");
    res.json(data);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "An error occurred while fetching users" });
  }
});

app.get('/user/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10); // Convert `id` to a number if it's an integer
  console.log("User ID:", id);

  try {
    const data = await prisma.user.findMany({
      where: {id: id},
      include: { posts: true }, 
    });

    if (data.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Fetched user:", data);
    res.json(data);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "An error occurred while fetching the user" });
  }
});

app.delete('/delete_user/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10); // Convert `id` to a number if it's an integer
  // console.log("User ID:", id);

  try {
    const data = await prisma.user.delete({
      where: {
        id: id, // Use the scalar value directly
      },
    });

    if (data.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Fetched user:", data);
    res.json(data);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "An error occurred while fetching the user" });
  }
});

app.delete('/delete_users', async (req, res) => {
  const id = parseInt(req.params.id, 10); // Convert `id` to a number if it's an integer

  try {
    const data = await prisma.user.deleteMany();

    if (data.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Fetched user:", data);
    res.json(data);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "An error occurred while fetching the user" });
  }
});


// API لإضافة مستخدم جديد
app.post('/new_user', async (req, res) => {
  try {
    const { name, email } = req.body;

    // التحقق من البيانات المرسلة
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Log the data to make sure it's being passed correctly
    console.log(`Creating user with name: ${name}, email: ${email}`);

    // Await the result of the prisma user creation
    const data = await prisma.user.create({
      data: {
        name: name,
        email: email,
      },
    });

    // استجابة مع بيانات المستخدم الذي تم إنشاؤه
    res.status(200).json({
      message: "User created successfully",
      dataCreate: data,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: error.message });
  }
});



// POST

// API لإضافة مستخدم جديد
app.post('/new_post', async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    // التحقق من البيانات المرسلة
    if (!title || !content) {
      return res.status(400).json({ error: "title and content are required" });
    }

    // Log the data to make sure it's being passed correctly
    console.log(`Creating user with title: ${title}, content: ${content}`);

    // Await the result of the prisma user creation
    const data = await prisma.post.create({
      data: {
        title: title,
        content: content,
        userId: userId
      },
    });

    // استجابة مع بيانات المستخدم الذي تم إنشاؤه
    res.status(200).json({
      message: "User created successfully",
      dataCreate: data,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: error.message });
  }
});
app.put('/update_post/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); // Parse the post ID
    const { title, content, userId } = req.body; // Extract data from the request body

    // Check if the post exists
    const existingPost = await prisma.post.findUnique({
      where: { id: id },
    });

    if (!existingPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Update the post in the database
    const updatedPost = await prisma.post.update({
      where: { id: id },
      data: {
        title: title,
        content: content,
        userId: userId,
      },
    });

    // Respond with the updated post data
    res.status(200).json({
      message: "Post updated successfully",
      updatedPost: updatedPost,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: error.message });
  }
});



app.delete('/delete_post/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const data = await prisma.post.delete({
      where: {
        id:id
      },
    });

    // استجابة مع بيانات المستخدم الذي تم إنشاؤه
    res.status(200).json({
      message: "Post delete successfully",
      dataCreate: data,
    });
  } catch (error) {
    console.error("Error deleteing post:", error);
    res.status(500).json({ error: error.message });
  }
});



// تشغيل الخادم
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
