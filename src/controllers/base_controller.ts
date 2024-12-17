import { Request, Response } from "express";

class BaseController {
  model: any;

  constructor(model: any) {
    this.model = model;
  }

  async getAll(req: Request, res: Response) {
    const filter = req.query;
    const data =
      Object.keys(filter).length === 0
        ? await this.model.find()
        : await this.model.find(filter);
    res.send(data);
  }

  async getById(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const data = await this.model.findById(id);
      if (data) {
        return res.send(data);
      } else {
        return res.status(404).send("item not found");
      }
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  async createItem(req: Request, res: Response) {
    try {
      const data = await this.model.create(req.body);
      res.status(201).send(data);
    } catch (err) {
      res.status(400).send(err);
    }
  }

  async updateItem(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const data = await this.model.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (data) {
        return res.send(data);
      } else {
        return res.status(404).send("item not found");
      }
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  async deleteItem(req: Request, res: Response) {
    const id = req.params.id;
    try {
      await this.model.findByIdAndDelete(id);
      return res.send("item deleted");
    } catch (err) {
      return res.status(400).send(err);
    }
  }
}

export default BaseController;
