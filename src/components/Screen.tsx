import { LinearGradient } from 'expo-linear-gradient';
import type { PropsWithChildren, ReactElement, ReactNode } from 'react';
import type { RefreshControlProps, StyleProp, ViewStyle } from 'react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette } from '../theme/palette';

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  footer?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  refreshControl?: ReactElement<RefreshControlProps>;
}>;

export function Screen({ children, scroll, footer, contentStyle, refreshControl }: ScreenProps) {
  const content = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, contentStyle]}
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, contentStyle]}>{children}</View>
  );

  return (
    <LinearGradient
      colors={[palette.backgroundTop, palette.backgroundBottom]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {content}
      </SafeAreaView>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
});
