interface ImageEntry {
    name: string;
    /** width / height */
    aspectRatio: number;
}

export const imageEntries: ImageEntry[] = [
    { name: "00_Bee_sitting_on_a_purple_flower.webp",                        aspectRatio: 2395 / 2993 },
    { name: "01_Sunset_over_Makara_hills_with_windmill_silhouettes.webp",    aspectRatio: 5184 / 2749 },
    { name: "02_Capybara_at_Wellington_zoo.webp",                            aspectRatio: 3833 / 2556 },
    { name: "08_Fruit_Splash.webp",                                          aspectRatio: 2849 / 3744 },
    { name: "09_A_leaf.webp",                                                aspectRatio: 2302 / 1866 },
    { name: "10_Happy_otter_napping.webp",                                   aspectRatio: 5185 / 3457 },
    { name: "11_Tui_hanging_upside_down_in_a_kowhai_tree.webp",              aspectRatio: 4219 / 2950 },
    { name: "12_Gas_burner_in_love.webp",                                    aspectRatio: 3496 / 2127 },
    { name: "13_Stunning_seagull.webp",                                      aspectRatio: 2849 / 4273 },
    { name: "14_Crab_chilling_under_some_water.webp",                        aspectRatio: 5185 / 3457 },
    { name: "15_The_glowing_man.webp",                                       aspectRatio: 1120 / 1899 },
    { name: "16_Wood_fire_burning_hot.webp",                                 aspectRatio: 5185 / 3457 },
    { name: "17_Huka_falls.webp",                                            aspectRatio: 5185 / 3457 },
    { name: "18_Fly_on_a_tree.webp",                                         aspectRatio: 5185 / 3457 },
    { name: "19_Morning_frost_on_a_green_wooden_railing.webp",               aspectRatio: 3649 / 1587 },
    { name: "20_Train_Platform.webp",                                        aspectRatio: 4228 / 2224 },
    { name: "21_Otters_sleeping.webp",                                       aspectRatio: 5185 / 3457 },
    { name: "22_Is_there_a_ghost.webp",                                      aspectRatio: 3865 / 2521 },
    { name: "23_Donkey_at_a_petting_zoo.webp",                               aspectRatio: 2849 / 4273 },
];

export const baseUrl = "https://static.chris-sa.com/gallery/";

export interface Photo {
    src: string;
    title: string;
    aspectRatio: number;
}

export function buildGalleryPhotos(): Photo[] {
    return imageEntries.map(({ name, aspectRatio }) => {
        const title = name.split(".")[0].substring(3).replace(/_/g, " ");
        return {
            src: `${baseUrl}${name}`,
            title,
            aspectRatio,
        };
    });
}

export function indexRecord(
    length: number,
    value: boolean
): Record<number, boolean> {
    const record: Record<number, boolean> = {};
    for (let i = 0; i < length; i++) {
        record[i] = value;
    }
    return record;
}

export const galleryPhotos = buildGalleryPhotos();
