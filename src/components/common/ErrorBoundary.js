// src/components/common/ErrorBoundary.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { colors, typography, spacing } from "../../constants/design-tokens";
import { ui } from "../../constants/theme";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details for debugging
        console.error("ErrorBoundary caught an error:", error, errorInfo);

        // TODO: Send to error tracking service (Sentry, etc.) when ready
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <View
                    style={[
                        ui.container,
                        ui.centerContent,
                        { backgroundColor: colors.bg },
                    ]}
                >
                    <Text
                        style={[
                            ui.h2,
                            ui.textWhite,
                            { marginBottom: spacing.md },
                        ]}
                    >
                        Oy vey!
                    </Text>
                    <Text
                        style={[
                            ui.paragraph,
                            ui.textWhite,
                            {
                                textAlign: "center",
                                marginBottom: spacing.lg,
                                paddingHorizontal: spacing.lg,
                            },
                        ]}
                    >
                        {this.props.fallbackMessage || "Something went wrong"}
                    </Text>
                    <TouchableOpacity
                        style={[ui.button, { backgroundColor: colors.brand }]}
                        onPress={this.handleReset}
                    >
                        <Text style={[ui.buttonText, ui.textWhite]}>
                            Try Again
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
