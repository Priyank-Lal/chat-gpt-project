import { useDispatch } from "react-redux";
import MainRoutes from "./routes/MainRoutes";
import { useEffect } from "react";
import { getUser } from "./store/actions/userAction";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);
  return (
    <>
      <div className="">
        <MainRoutes />
      </div>
    </>
  );
};

export default App;
