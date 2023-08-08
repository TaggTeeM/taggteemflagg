import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export const IconButton = (onPress: any, icon: any) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {icon}
    </TouchableOpacity>
  );

const styles = StyleSheet.create({
    button: {
        marginLeft: 16,
    },
});

