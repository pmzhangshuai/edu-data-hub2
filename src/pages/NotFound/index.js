import { jsx as _jsx } from "react/jsx-runtime";
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
const NotFound = () => {
    const navigate = useNavigate();
    return (_jsx(Result, { status: "404", title: "404", subTitle: "\u62B1\u6B49\uFF0C\u60A8\u8BBF\u95EE\u7684\u9875\u9762\u4E0D\u5B58\u5728\u3002", extra: _jsx(Button, { type: "primary", onClick: () => navigate('/home'), children: "\u8FD4\u56DE\u9996\u9875" }) }));
};
export default NotFound;
