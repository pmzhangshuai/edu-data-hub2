import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import { Result, Button } from 'antd';
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        Object.defineProperty(this, "handleReload", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                this.setState({ hasError: false, error: undefined });
                window.location.reload();
            }
        });
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (_jsx(Result, { status: "error", title: "\u9875\u9762\u51FA\u9519\u4E86", subTitle: this.state.error?.message || '发生了未知错误', extra: _jsx(Button, { type: "primary", onClick: this.handleReload, children: "\u91CD\u65B0\u52A0\u8F7D" }) }));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
