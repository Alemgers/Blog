const Blog = require("./blog");
const fs = require("fs");
const path = require("path");

const createBlog = async (req, res) => {
  if (
    req.file &&
    req.body.name.length > 2 &&
    req.body.description.length > 2 &&
    req.body.genre.length > 2
  ) {
    await new Blog({
      name: req.body.name,
      genre: req.body.genre,
      description: req.body.description,
      image: `/img/blogs/${req.file.filename}`,
      author: req.user._id,
    }).save();
    res.redirect(`/profile/${req.user._id}`);
  } else {
    res.redirect("/new?error=1");
  }
};

const editBlog = async (req, res) => {
  if (
    req.body.name.length > 2 &&
    req.body.description.length > 2 &&
    req.body.genre.length > 2
  ) {
    const blogs = await Blog.findById(req.body.id);
    const updatedBlog = {
      name: req.body.name,
      genre: req.body.genre,
      description: req.body.description,
      author: req.user._id,
    };
    if (req.file) {
      const filePath = path.join(__dirname + "../../../public" + blogs.image);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
      updatedBlog.image = `/img/blogs/${req.file.filename}`;
    }
    await Blog.findByIdAndUpdate(req.body.id, updatedBlog);
    res.redirect("/profile/" + req.user._id);
  } else {
    res.redirect(`/edit/${req.body.id}?error=99`);
  }
};

const deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog) {
    fs.unlinkSync(path.join(__dirname + "../../../public" + blog.image));
    await Blog.deleteOne({ _id: req.params.id });
    res.status(200).send("ok");
  } else {
    res.status(404).send("Not Found");
  }
};
module.exports = {
  createBlog,
  editBlog,
  deleteBlog,
};
