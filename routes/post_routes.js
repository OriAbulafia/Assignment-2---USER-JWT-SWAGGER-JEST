import express from 'express';
import { createPost, updatePost, getAllPosts, getPostById ,deletePost} from '../controllers/post_controller.js';

const router = express.Router();

router.route('/').post(createPost);
router.route('/').get(getAllPosts);
router.route('/all').get(getAllPosts);
router.route('/:id').put(updatePost);
router.route('/:id').get(getPostById);
router.route('/:id').delete(deletePost);

export default router
