import { Router } from "express";
import AuthControllerComposer from "../composers/auth-controller-composer";
import ExpressRouterAdapter from "../adapters/express-router-adapter";
import SingupControllerComposer from "../composers/singup-controller-composer";


const userRouter = Router();
const authController = AuthControllerComposer.compose();
const singupController = SingupControllerComposer.compose();

userRouter.post("/user/auth", ExpressRouterAdapter.adapt(authController));
userRouter.post("/user/singup", ExpressRouterAdapter.adapt(singupController));

export default userRouter;