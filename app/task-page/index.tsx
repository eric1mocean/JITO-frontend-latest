import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";


const TaskPage = () => {

    const { id } = useLocalSearchParams();
    return (
        <View>
            <Text>ID-ul primit: {id}</Text>
        </View>
    )
}

export default TaskPage