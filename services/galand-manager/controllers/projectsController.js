const _ = require("lodash");
const express = require("express");
const request = require("request");

const {crudService} = require("../services/");
const projectsCrud = crudService("Project");

function getProject(req, res) {
  const {id} = req.params;
  projectsCrud
      .getRecord({_id: id})
      .then((record) => {
        res.json(record);
      })
      .catch((err) => res.status(500).json({message: err.message}));
}

function getProjects(req, res) {
  const query = {};
  projectsCrud
      .getRecords(query)
      .then((records) => {
        res.json(records);
      })
      .catch((err) => {
        res.status(500).json({message: err.message});
      });
}

function updateProject(req, res) {
  const {id} = req.params;
  projectsCrud
      .getRecord({_id: id})
      .then((record) => {
        if (!record) {
          return res.status(404).json({message: "Not found"});
        }
        return projectsCrud.addRecord({...record, ...req.body}).then((record) => {
          res.json(record);
        });
      })
      .catch((err) => {
        res.status(500).json({message: err.message});
      });
}

function createProject(req, res) {
  const {_id} = req.user;
  const project = req.body;
  const {startProject,endProject} = req.body;
  project.creator = _id;
  project.assignees = [_id].concat(project.assignees);
  projectsCrud.getRecords({}).then((records)=>{
    const sameProjectName = records.filter(el=> el.title === req.body.title);
    if(sameProjectName.length){
      return res.status(422).json({message : "Title used for another project"});
    }
    if(startProject > endProject){
      return res.status(422).json({message : "End of the project cannot be before its start"});
    }
    projectsCrud
      .createNew(req.body)
      .then((record) => {
        res.json(record);
      })
      .catch((err) => {
        res.status(500).json({message: err.message});
      });
  }).catch((err) => {
    res.status(500).json({message: err.message});
  });
  
}

function removeProject(req, res) {
  const {id} = req.params;
  projectsCrud
      .deleteRecord({_id: id})
      .then(() => {
        res.status(200).json({_id: id, deleted: true});
      })
      .catch((e) => {
        console.log(e);
        res.status(500).json(e);
      });
}
module.exports = {
  createProject,
  removeProject,
  getProjects,
  getProject,
  updateProject,
};
