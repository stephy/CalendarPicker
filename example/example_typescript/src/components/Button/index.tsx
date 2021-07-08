import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TouchableOpacityProps } from 'react-native';
import { colors } from '../../global/colors';

// Icon URI
const uri = "https://img.icons8.com/ios/500/plus-minus.png"

interface ButtonProps extends TouchableOpacityProps {
    text?: string,
    showIcon?: boolean,
    line?: boolean
}

export function Button(props: ButtonProps) {
    const { text, showIcon = false, line = false } = props

    return (
        <TouchableOpacity style={styles.touchable} {...props} >
            <View style={styles.row}>
                {
                    showIcon ? (
                        <Image
                            source={{ uri }}
                            style={styles.image}
                        />
                    )
                        : null
                }
                <Text style={[styles.text, { textDecorationLine: !line ? "none" : "underline" }]}>
                    {text || ""}
                </Text>
            </View>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    touchable: {
        backgroundColor: colors.primary,
        borderRadius: 5,
    },
    image: {
        width: 25,
        height: 25
    },
    row: {
        flexDirection: "row",
        padding: 10,
        alignContent: "center",
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    text: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: "700"
    }
});

