const express = require('express');
const server = express();

let projects = [];

function notEmpty(req, res, next) {
  if (projects.length == 0) {
    return res.status(500).json({message: 'There is no projects'});
  }

  return next();
}

function projectExists(req, res, next) {
  const id = req.params.id;

  if (!id) {
    return res.staus(400).json({message: 'ID must be informed'});
  }

  exists = projects.filter((element) => element.id == id)[0];

  if (!exists) { 
    return res.status(404).json({message: 'Project not found'});
  }

  req.project = exists;

  return next();
}

server.use(express.json());

server.get('/projects', (req, res)=> {
  return res.json(projects);
});

server.post('/projects', (req, res) => {
  const project = req.body;

  if (!project) {
    return res.status(400).json({message: 'Could not insert new project'});
  }

  projects.push(project);
  return res.json(project);
});

server.put('/projects/:id', notEmpty, projectExists, (req, res) => {
  const oldProject = req.project
  const newTitle = req.body.title;

  if (!newTitle) {
    return res.status(400).json({message: 'Title must be informed'});
  }

  index = projects.indexOf(oldProject);

  projects[index].title = newTitle;
  return res.json(projects[index]);
});

server.delete('/projects/:id', notEmpty, projectExists, (req, res) => {
  const projectToDelete = req.project

  index = projects.indexOf(projectToDelete);

  projects.splice(index, 1);

  return res.json(projects);
});

server.post('/projects/:id/tasks', notEmpty, projectExists, (req, res) => {
  const task = req.body.title;

  if (!task) {
    return res.status(400).json({message: 'Task must be informed'});
  }

  const project = req.project

  index = projects.indexOf(project);

  projects[index].tasks.push(task);

  return res.json(projects[index]);
});

server.listen(3000);