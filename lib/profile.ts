import { intOr } from './common';

export type GameProfile = {
    game_version: number;
    name: string;
    music_group: number;
    music_index: number;
    sheet_type: number;
    perform_type: number;
    filter_flag: number;
    brooch_index: number;
    hi_speed_level: number;
    beat_guide: number;
    headphone_volume: number;
    judge_bar_pos: number;
    hands_mode: number;
    near_setting: number;
    judge_delay_offset: number;
    key_beam_level: number;
    orbit_type: number;
    note_height: number;
    note_width: number;
    judge_width_type: number;
    beat_guide_volume: number;
    beat_guide_type: number;
    key_volume_offset: number;
    bgm_volume_offset: number;
    note_disp_type: number;
    slow_fast: number;
    option_setting: number;
    judge_effect_adjust: number;
    simple_bg: number;
    bingo_index: number;
    class_basic: number;
    class_recital: number;
    grade_basic: number;
    grade_recital: number;
    money: number;
    pianist_power: number;
    fame_index: number;
    kingdom_id: number;
    quest_index: number;
    param1: number[];
    param2: number[];
};

type NostalgiaProfileData = {
    collection: 'profile';
    name?: string;
    profile?: GameProfile;
    versions?: Record<string, GameProfile>;
};

export function defaultGameProfile(name: string): GameProfile{
    return {
        game_version: 0,
        name,
        music_group: 0,
        music_index: 0,
        sheet_type: 0,
        perform_type: 0,
        filter_flag: 0,
        brooch_index: 0,
        hi_speed_level: 0,
        beat_guide: 0,
        headphone_volume: 0,
        judge_bar_pos: 250,
        hands_mode: 0,
        near_setting: 0,
        judge_delay_offset: 0,
        key_beam_level: 0,
        orbit_type: 0,
        note_height: 10,
        note_width: 10,
        judge_width_type: 10,
        beat_guide_volume: 0,
        beat_guide_type: 0,
        key_volume_offset: 0,
        bgm_volume_offset: 0,
        note_disp_type: 0,
        slow_fast: 0,
        option_setting: 0,
        judge_effect_adjust: 0,
        simple_bg: 0,
        bingo_index: 0,
        class_basic: 0,
        class_recital: 0,
        grade_basic: 0,
        grade_recital: 0,
        money: 0,
        pianist_power: 0,
        fame_index: 0,
        kingdom_id: 0,
        quest_index: 0,
        param1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        param2: [0, 0, 0, 0, 0, 0, 0, 0],
    };
}

export async function getProfile(refid: string): Promise<ProfileDoc<NostalgiaProfileData> | null>{
    return (await DB.FindOne(refid, { collection: 'profile' })) as ProfileDoc<NostalgiaProfileData> | null;
}

export async function ensureProfile(
    refid: string,
    name: string,
    _model: string,
): Promise<ProfileDoc<NostalgiaProfileData>>{
    const exists = await getProfile(refid);

    if(exists){
        const profile = getGameProfile(exists) || defaultGameProfile(name || exists.name || '');
        const update: any = { $set: { profile }, $unset: { versions: true } };
        if(name && name !== exists.name){
            update.$set.name = name;
        }
        await DB.Upsert(refid, { collection: 'profile' }, update);
        exists.profile = profile;
        return exists;
    }

    const profile = defaultGameProfile(name);

    const doc: ProfileDoc<NostalgiaProfileData> = { collection: 'profile', name, profile };
    await DB.Upsert(refid, { collection: 'profile' }, { $set: doc });
    return doc;
}

export function getGameProfile(profile: ProfileDoc<NostalgiaProfileData> | null): GameProfile | null{
    if(!profile) return null;
    if(profile.profile){
        return profile.profile;
    }
    const legacyVersions = profile.versions || {};
    const keys = Object.keys(legacyVersions);
    if(keys.length === 0) return null;
    const latestKey = keys
        .filter(k => Number.isFinite(Number(k)))
        .sort((a, b) => Number(b) - Number(a))[0];
    if(latestKey && legacyVersions[latestKey]){
        return legacyVersions[latestKey];
    }
    return legacyVersions[keys[0]] || null;
}

export function getNumListFromSpaceSeparated(value: string): number[]{
    if(!value) return [];
    return value
        .split(' ')
        .map(v => intOr(v, 0))
        .filter(v => Number.isFinite(v));
}

export function parseParamValues(value: any): number[]{
    if(Array.isArray(value)){
        return value.map(v => intOr(v, 0));
    }
    if(typeof value === 'string'){
        return getNumListFromSpaceSeparated(value);
    }
    return [];
}
