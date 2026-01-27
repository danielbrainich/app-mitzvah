// src/components/common/ErrorBoundary.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <View style={[ui.safeArea, ui.centerContent]}>
                    <Text
                        style={[
                            ui.h2,
                            ui.textBrand,
                            ui.textCenter,
                            ui.mb3,
                            { writingDirection: "rtl" },
                        ]}
                    >
                        חבל!
                    </Text>{" "}
                    <Text
                        style={[
                            ui.paragraph,
                            ui.textCenter,
                            ui.mb5,
                            styles.message,
                        ]}
                    >
                        Something went wrong. Please try again.
                    </Text>
                    <TouchableOpacity
                        style={[ui.button, ui.buttonOutline]}
                        onPress={this.handleReset}
                    >
                        <Text style={ui.buttonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    message: {
        paddingHorizontal: 32,
    },
});

export default ErrorBoundary;
