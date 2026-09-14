import {create} from 'zustand';
import {GeneratorStore} from "./GeneratorStore";
import {API} from "../../types/API";
import {polarToCartesian} from "../../utils/MathUtils";
import {useGalleryStore} from "../GalleryStore/useGalleryStore";

const RANDOM_FORMULAS = [
    'Math.sin(2 * a)',
    'Math.cos(3 * a)',
    '1 + 0.5 * Math.sin(6 * a)',
    'a * 0.05', // Изменен шаг для спирали
    'Math.sin(4 * a) + Math.cos(2 * a)'
];

export const useGeneratorStore = create<GeneratorStore>((set, get) => ({
    formula: 'Math.sin(2 * a)',
    turns: 3,
    fixedStep: 0.03,
    pointsPolar: [],
    isLoading: false,
    status: null,
    isError: false,
    calculatedPointsCount: 0,

    setField: (field, value) => {
        set({[field]: value});
        get().generatePoints();
    },

    setRandomFormula: () => {
        const randomIndex = Math.floor(Math.random() * RANDOM_FORMULAS.length);
        set({formula: RANDOM_FORMULAS[randomIndex]});
        get().generatePoints();
    },

    generatePoints: () => {
        const {formula, turns, fixedStep} = get();
        const pointsPolar: [number, number][] = [];
        const maxAngle = turns * 2 * Math.PI;
        const microStep = 0.0005;
        const maxPointsLimit = 3000;
        try {
            const fn = new Function('a', `return Math.max(0, Math.min(1,(${formula})));`);
            let a = 0, x, y, X = 0, Y = 0, r = fn(a);
            pointsPolar.push([a, r]);
            [x, y] = polarToCartesian(a, r);
            while (a < maxAngle && pointsPolar.length < maxPointsLimit) {
                let d = 0;
                while (d < fixedStep && a < maxAngle) {
                    a += microStep;
                    r = fn(a);
                    [X, Y] = polarToCartesian(a, r);
                    d = Math.hypot(X - x, Y - y);
                }
                if (a < maxAngle) {
                    x = X;
                    y = Y;
                    pointsPolar.push([a, r]);
                }
            }
            set({
                pointsPolar,
                calculatedPointsCount: pointsPolar.length,
                status: null,
                isError: false
            });
        } catch (err) {
            set({
                pointsPolar: [],
                calculatedPointsCount: 0,
                status: 'Invalid formula syntax',
                isError: true
            });
        }
    },

    uploadPoints: async () => {
        const {pointsPolar} = get();
        if (pointsPolar.length === 0)
            return;

        set({isLoading: true, status: 'Uploading data to ESP32...', isError: false});

        const uploadResponse = await (await fetch(API.GALLERY_UPLOAD, {
            method: "POST",
            body: new Float32Array(pointsPolar.flat()).buffer,
            headers: {'Content-Type': 'application/octet-stream'}
        })).json();

        const metaData = {
            id: uploadResponse.id,
            name: "example",
            points: pointsPolar.length
        };
        const metaDataResponse = await fetch(API.GALLERY_METADATA, {
            method: "POST",
            body: JSON.stringify(metaData),
            headers: {'Content-Type': 'application/json', 'X-Id': uploadResponse.id}
        });

        let ok = metaDataResponse.ok;
        set({
            isLoading: false,
            status: ok ? 'Success! Pattern sent to ESP32' : 'Failed to upload coordinates',
            isError: !ok
        });

        let allItems = useGalleryStore.getState().allItems;

        useGalleryStore.setState({
            allItems: [...allItems, metaData]
        });
        useGalleryStore.getState().loadPageItems()
    }
}));


