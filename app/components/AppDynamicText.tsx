import React from 'react';
import { Text, TextProps } from 'react-native';
import { AppFonts, FontSize } from '../assets/fonts';
import { useTheme } from '../theme/ThemeProvider';

interface AppDynamicTextProps extends TextProps {
    text: string;
    boldPhrases?: string[];
    links?: { phrase: string; onPress: () => void }[];
    textColor?: string;
    fontSize?: number;
    textAlign?: 'left' | 'right' | 'center' | 'justify';
    numberOfLines?: number;
}

const AppDynamicText = ({
    text,
    boldPhrases = [],
    links = [],
    textColor,
    fontSize = FontSize._14,
    textAlign = 'left',
    numberOfLines,
    style,
    ...props
}: AppDynamicTextProps) => {
    const { AppColors } = useTheme();

    // Split and decorate the text
    const getDecoratedParts = () => {
        const allPhrases = [...boldPhrases, ...links.map((l) => l.phrase)];
        if (allPhrases.length === 0) {
            return [{ type: 'normal', content: text }];
        }

        const pattern = new RegExp(`(${allPhrases.map(escapeRegExp).join('|')})`, 'gi');
        const parts = text.split(pattern).filter(Boolean);

        return parts.map((part, index) => {
            const link = links.find((l) => l.phrase.toLowerCase() === part.toLowerCase());
            if (link) {
                return { type: 'link', content: part, onPress: link.onPress };
            }

            if (boldPhrases.some(p => p.toLowerCase() === part.toLowerCase())) {
                return { type: 'bold', content: part };
            }

            return { type: 'normal', content: part };
        });
    };

    const decoratedParts = getDecoratedParts();

    return (
        <Text
            {...props}
            style={[
                {
                    color: textColor || AppColors.textColor,
                    fontSize,
                    fontFamily: AppFonts.REGULAR,
                    textAlign,
                },
                style,
            ]}
            numberOfLines={numberOfLines}
        >
            {decoratedParts.map((part, index) => {
                if (part.type === 'bold') {
                    return (
                        <Text
                            key={index}
                            style={{ fontFamily: AppFonts.BOLD }}
                        >
                            {part.content}
                        </Text>
                    );
                }

                if (part.type === 'link') {
                    return (
                        <Text
                            key={index}
                            style={{ color: AppColors.primary100, textDecorationLine: 'underline' }}
                            onPress={part.onPress}
                        >
                            {part.content}
                        </Text>
                    );
                }

                return <Text key={index}>{part.content}</Text>;
            })}
        </Text>
    );
};

// Helper function to safely escape RegExp characters
const escapeRegExp = (str: string) =>
    str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');

export default AppDynamicText;
