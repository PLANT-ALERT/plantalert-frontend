import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Modal, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import ProgressBar from "@/components/ProgressBar"
import {getColors} from "@/constants/Colors";

let colors = getColors();

export default function PlantCard(props: {name: string, age: string, image?: string, progress: number}) {
    const {name, age, image, progress} = props;
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    return (
        <>
            <TouchableOpacity
                onPress={toggleModal}
                style={styles.card}
            >
                <View style={styles.wrapper}>
                    <Image
                        style={styles.image}
                        source={image ?? require("@/assets/images/chinese-money-plant.png")}
                        alt="Plant Icon"
                    />
                    <View style={{ display: "flex", flexDirection: "column" }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>{name}</Text>
                        <Text style={{ fontSize: 17, fontWeight: '500', color: colors.subtitle, fontStyle: 'italic'}}>Zasazeno: {age}</Text>
                    </View>
                </View>
                <ProgressBar progress={progress} max={100} />
            </TouchableOpacity>

            {/* Modal */}
            <Modal
                visible={isModalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={toggleModal}
            >
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback onPress={toggleModal}>
                        <View style={styles.modalBackground} />
                    </TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Detailed Plant Information</Text>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    card: {
        flexDirection: 'column',
        padding: 10,
        borderRadius: 12,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    image: {
        width: 80, // Fixed width for the image
        height: 80, // Fixed height for the image
        resizeMode: 'contain', // Properly scale the image
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContent: {
        width: '90%', // Nearly full-screen modal
        height: '90%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
    },
    modalText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1f2937',
    },
});
