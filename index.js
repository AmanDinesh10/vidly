const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json());

const courses = [
  {
    id: 1,
    name: "course1",
  },
  {
    id: 2,
    name: "course2",
  },
  {
    id: 3,
    name: "course3 ",
  },
];

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

// api/courses/1
// app.get('/api/posts/:year/:month', (req, res) => {
//     // res.send(req.params)
//     res.send(req.query)
// });

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  // const course = courses.find((c) => c.id === req.params.id * 1);

  if (!course)
    return res.status(404).send("The course with the given ID was not found"); // 404
  // if (!course) res.status(404).json({error: 'The course with the given ID was not found'})

  res.send(course);
});

app.post("/api/courses", (req, res) => {
  // Input Validation
  // if (!req.body.name || req.body.name.length < 3) {
  //     // 400 Bad Request
  //     res.status(400).send('Name is required and should be minimum 3 characters.');
  //     return;
  // }

  // Or with use of Joi
  // const result = validateCourse(req.body);
  const { error } = validateCourse(req.body); // result.error
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).send("The course with the given ID was not found");
  }

  // const result = validateCourse(req.body);
  const { error } = validateCourse(req.body); // result.error

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  course.name = req.body.name;
  res.send(course);
});

// PATCH
app.patch("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).send("The course with the given ID was not found");
  }

  // const result = validateCourse(req.body);
  const { error } = validateCourse(req.body); // result.error

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  course.name = req.body.name;
  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  // Look up the course
  // Not existing, return 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found");

  // Delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
});

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(course, schema);
}

// PORT
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));
