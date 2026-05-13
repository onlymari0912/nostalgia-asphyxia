import * as path from 'path';

import {intOr} from './common';

type MusicRecord = {
    index: string;
    priority: number;
    category_flag: number;
    primary_category: number;
    level_normal: number;
    level_hard: number;
    level_extreme: number;
    level_real: number;
    demo_popular: boolean;
    demo_bemani: boolean;
    destination_j: boolean;
    destination_a: boolean;
    destination_y: boolean;
    destination_k: boolean;
    offline: boolean;
    unlock_type: number;
    volume_bgm: number;
    volume_key: number;
    jk_jpn: boolean;
    jk_asia: boolean;
    jk_kor: boolean;
    jk_idn: boolean;
    real_unlock_type: number;
    real_once_price: number;
    real_forever_price: number;
};

type MusicCache = {
    revision: string;
    releaseCode: string;
    songs: MusicRecord[];
};

let musicCache: MusicCache | null = null;

function parseSong(raw: any): MusicRecord{
    const getInt = (k: string) => intOr(raw[k]);
    const getBool = (k: string) => !!raw[k];
    return {
        index: String(raw?.index ?? '0'),
        priority: getInt('priority'),
        category_flag: getInt('category_flag'),
        primary_category: getInt('primary_category'),
        level_normal: getInt('level_normal'),
        level_hard: getInt('level_hard'),
        level_extreme: getInt('level_extreme'),
        level_real: getInt('level_real'),
        demo_popular: getBool('demo_popular'),
        demo_bemani: getBool('demo_bemani'),
        destination_j: getBool('destination_j'),
        destination_a: getBool('destination_a'),
        destination_y: getBool('destination_y'),
        destination_k: getBool('destination_k'),
        offline: getBool('offline'),
        unlock_type: getInt('unlock_type'),
        volume_bgm: getInt('volume_bgm'),
        volume_key: getInt('volume_key'),
        jk_jpn: getBool('jk_jpn'),
        jk_asia: getBool('jk_asia'),
        jk_kor: getBool('jk_kor'),
        jk_idn: getBool('jk_idn'),
        real_unlock_type: getInt('real_unlock_type'),
        real_once_price: getInt('real_once_price'),
        real_forever_price: getInt('real_forever_price'),
    };
}

export async function loadMusicCache(): Promise<MusicCache>{
    if(musicCache) return musicCache;

    let revision = '21261';
    let releaseCode = '2021090800';
    const songs: MusicRecord[] = [];
    musicCache = {revision, releaseCode, songs};

    const filePath = path.join(__dirname, '..', 'music_list.json');
    if(!IO.Exists(filePath)) return musicCache;

    const buffer = await IO.ReadFile(filePath);
    if(!buffer) return musicCache;

    try{
        // UTF-8 JSON 포맷 파싱
        const parsed = JSON.parse(Buffer.isBuffer(buffer) ? buffer.toString('utf8') : String(buffer));

        musicCache.revision = String(parsed.revision ?? revision);
        musicCache.releaseCode = String(parsed.releaseCode ?? releaseCode);

        let entries = [];
        if(Array.isArray(parsed.music_spec)){
            entries = parsed.music_spec;
        }else if(!!parsed.music_spec){
            entries = [parsed.music_spec];
        }
        for(const e of entries) songs.push(parseSong(e));
    }catch(err){
        console.error('Failed to parse music_list.json:', err);
    }
    return musicCache;
}

export function makePermittedList(){
    const v = [
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    ];
    return {
        flag: [
            K.ARRAY('s32', v, {sheet_type: '0'}),
            K.ARRAY('s32', v, {sheet_type: '1'}),
            K.ARRAY('s32', v, {sheet_type: '2'}),
            K.ARRAY('s32', v, {sheet_type: '3'}),
        ],
    };
}

export function makeMusicSpec(song: MusicRecord){
    return K.ATTR(
        {index: song.index},
        {
            basename: K.ITEM('str', ''),
            title: K.ITEM('str', ''),
            title_kana: K.ITEM('str', ''),
            artist: K.ITEM('str', ''),
            artist_kana: K.ITEM('str', ''),
            license: K.ITEM('str', ''),
            license_site: K.ITEM('str', ''),
            priority: K.ITEM('s8', song.priority),
            category_flag: K.ITEM('s32', song.category_flag),
            primary_category: K.ITEM('s8', song.primary_category),
            level_normal: K.ITEM('s8', song.level_normal),
            level_hard: K.ITEM('s8', song.level_hard),
            level_extreme: K.ITEM('s8', song.level_extreme),
            level_real: K.ITEM('s8', song.level_real),
            demo_popular: K.ITEM('bool', song.demo_popular),
            demo_bemani: K.ITEM('bool', song.demo_bemani),
            destination_j: K.ITEM('bool', song.destination_j),
            destination_a: K.ITEM('bool', song.destination_a),
            destination_y: K.ITEM('bool', song.destination_y),
            destination_k: K.ITEM('bool', song.destination_k),
            offline: K.ITEM('bool', song.offline),
            unlock_type: K.ITEM('s8', song.unlock_type),
            volume_bgm: K.ITEM('s8', song.volume_bgm),
            volume_key: K.ITEM('s8', song.volume_key),
            start_date: K.ITEM('str', '2017-03-01 10:00'),
            end_date: K.ITEM('str', '9999-12-31 23:59'),
            expiration_date: K.ITEM('str', '9999-12-31 23:59'),
            description: K.ITEM('str', ''),
        },
    );
}

export function makeOverwriteMusicSpec(song: MusicRecord){
    return K.ATTR(
        {index: song.index},
        {
            jk_jpn: K.ITEM('bool', song.jk_jpn),
            jk_asia: K.ITEM('bool', song.jk_asia),
            jk_kor: K.ITEM('bool', song.jk_kor),
            jk_idn: K.ITEM('bool', song.jk_idn),
            unlock_type: K.ITEM('s8', song.unlock_type),
            real_unlock_type: K.ITEM('s8', song.real_unlock_type),
            start_date: K.ITEM('str', '2017-03-01 10:00'),
            end_date: K.ITEM('str', '9999-12-31 23:59'),
            real_once_price: K.ITEM('s32', song.real_once_price),
            real_forever_price: K.ITEM('s32', song.real_forever_price),
            real_start_date: K.ITEM('str', '2017-03-01 10:00'),
            real_end_date: K.ITEM('str', '9999-12-31 23:59'),
        },
    );
}
