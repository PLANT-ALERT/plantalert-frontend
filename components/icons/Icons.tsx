import {Image} from 'react-native';

export enum IconTypes {
    DROP = "DROP"
}

export function Icons({ name }: { name: IconTypes }) {

    if (name == IconTypes.DROP) {
        return (
            <Image src="./images/droplet.png" />
        )
    }

}