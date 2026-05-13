import {
    loadMusicCache,
    makeMusicSpec,
    makeOverwriteMusicSpec,
    makePermittedList,
} from '../lib/music';

export const handleCommonInfo = async (_info: EamuseInfo, _data: any, send: EamuseSend) => {
    return send.object({
        olupdate: {
            delete_flag: K.ITEM('bool', false),
        },
    }, {rootName: 'get_common_info'});
};

export const handleMusicInfo = async (_info: EamuseInfo, _data: any, send: EamuseSend) => {
    const music = await loadMusicCache();
    void send.object({
        music_list: K.ATTR({revision: music.revision, release_code: music.releaseCode}, {
            music_spec: music.songs.map(makeMusicSpec),
        }),
        overwrite_music_list: K.ATTR({revision: music.revision, release_code: music.releaseCode}, {
            music_spec: music.songs.map(makeOverwriteMusicSpec),
        }),
        permitted_list: makePermittedList(),
        gamedata_flag_list: {},
        trend_music_list: {
            trend_music: K.ATTR({music_index: '1', rank: '1'}),
        },
    }, { rootName: 'get_music_info' });
};
