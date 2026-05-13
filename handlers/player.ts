import {firstNode, intOr} from '../lib/common';
import {makePermittedList} from '../lib/music';
import {
    defaultGameProfile,
    ensureProfile,
    getGameProfile,
    parseParamValues,
    getProfile,
} from '../lib/profile';

function getRoot(data: any){
    return $(firstNode(data));
}

export const handlePlayerRegister = async (info: EamuseInfo, data: any, send: EamuseSend) => {
    const root = getRoot(data);
    const refid = root.str('refid', '');
    const name = root.str('name', '');

    if(!refid){
        return send.deny();
    }

    await ensureProfile(refid, name, info.model);
    return send.object({
        permitted_list: makePermittedList(),
        valid_quest_list: {
            quest: K.ATTR({index: '1'}),
        },
        valid_course_list: {
            course: K.ATTR({index: '1'}),
        },
        name: K.ITEM('str', name),
        play_count: K.ITEM('s32', 0),
        today_play_count: K.ITEM('s32', 0),
        old_play_count: K.ITEM('s32', 0),
        old_recital_count: K.ITEM('s32', 0),
        music_list: makePermittedList(),
        free_for_play_music_list: makePermittedList(),
        last: {
            music_group: K.ITEM('s32', 0),
            music_index: K.ITEM('s32', 0),
            sheet_type: K.ITEM('s8', 0),
            perform_type: K.ITEM('s32', 0),
            filter_flag: K.ITEM('u64', BigInt(0)),
            brooch_index: K.ITEM('s32', 0),
            hi_speed_level: K.ITEM('s32', 0),
            beat_guide: K.ITEM('s8', 0),
            headphone_volume: K.ITEM('s8', 0),
            judge_bar_pos: K.ITEM('s32', 0),
            hands_mode: K.ITEM('s8', 0),
            near_setting: K.ITEM('s8', 0),
            judge_delay_offset: K.ITEM('s8', 0),
            key_beam_level: K.ITEM('s8', 0),
            orbit_type: K.ITEM('s8', 0),
            note_height: K.ITEM('s8', 0),
            note_width: K.ITEM('s8', 0),
            judge_width_type: K.ITEM('s8', 0),
            beat_guide_volume: K.ITEM('s8', 0),
            beat_guide_type: K.ITEM('s8', 0),
            key_volume_offset: K.ITEM('s8', 0),
            bgm_volume_offset: K.ITEM('s8', 0),
            note_disp_type: K.ITEM('s8', 0),
            slow_fast: K.ITEM('s8', 0),
            option_setting: K.ITEM('s32', 0),
            judge_effect_adjust: K.ITEM('s8', 0),
            simple_bg: K.ITEM('s8', 0),
            bingo_index: K.ITEM('s32', 0),
        },
        travel: {
            money: K.ITEM('s32', 0),
            pianist_power: K.ITEM('s32', 0),
            fame_index: K.ITEM('s32', 0),
            kingdom_id: K.ITEM('s32', 0),
            quest_index: K.ITEM('s32', 0),
        },
    }, {rootName: 'regist_playdata'});
};

export const handlePlayerMusicData = async (_info: EamuseInfo, data: any, send: EamuseSend) => {
    const root = getRoot(data);
    const refid = root.str('refid', '');
    if(!refid){
        return send.status(1);
    }

    const records = await DB.Find(refid, {collection: 'score_best'});
    const music = (records || []).map((r: any) => {
        const recital = {
            score: K.ITEM('s32', intOr(r.score)),
            play_count: K.ITEM('s32', intOr(r.play_count)),
            clear_count: K.ITEM('s32', intOr(r.clear_count)),
            multi_count: K.ITEM('s32', intOr(r.multi_count)),
            clear_flag: K.ITEM('s32', intOr(r.clear_flag)),
            hands_mode: K.ITEM('s8', intOr(r.hands_mode)),
            evaluation: K.ITEM('u32', 5),
            grade: K.ITEM('u32', intOr(r.grade)),
        };

        return {
            '@attr': {
                sheet_type: String(intOr(r.sheet_type)),
                music_index: String(intOr(r.music_index)),
            },
            recital,
            ...recital,
        };
    });
    send.object({music}, {rootName: 'get_musicdata'});
};

export const handlePlayerPlayData = async (info: EamuseInfo, data: any, send: EamuseSend) => {
    const root = getRoot(data);
    const refid = root.str('refid', '');
    if(!refid){
        send.status(1);
        return;
    }

    let profile = await getProfile(refid);
    if(!profile){
        profile = await ensureProfile(refid, '', info.model);
    }
    let gameProfile =
        getGameProfile(profile);
    if(!gameProfile){
        gameProfile = defaultGameProfile('');
    }
    send.object({
        permitted_list: makePermittedList(),
        name: K.ITEM('str', gameProfile.name),
        play_count: K.ITEM('s32', 0),
        today_play_count: K.ITEM('s32', 0),
        old_play_count: K.ITEM('s32', 0),
        old_recital_count: K.ITEM('s32', 0),
        music_list: makePermittedList(),
        free_for_play_music_list: makePermittedList(),
        last: {
            music_group: K.ITEM('s32', intOr(gameProfile.music_group)),
            music_index: K.ITEM('s32', intOr(gameProfile.music_index)),
            sheet_type: K.ITEM('s8', intOr(gameProfile.sheet_type)),
            perform_type: K.ITEM('s32', intOr(gameProfile.perform_type)),
            filter_flag: K.ITEM('u64', BigInt(intOr(gameProfile.filter_flag))),
            brooch_index: K.ITEM('s32', intOr(gameProfile.brooch_index)),
            hi_speed_level: K.ITEM('s32', intOr(gameProfile.hi_speed_level)),
            beat_guide: K.ITEM('s8', intOr(gameProfile.beat_guide)),
            headphone_volume: K.ITEM('s8', intOr(gameProfile.headphone_volume)),
            judge_bar_pos: K.ITEM('s32', intOr(gameProfile.judge_bar_pos)),
            hands_mode: K.ITEM('s8', intOr(gameProfile.hands_mode)),
            near_setting: K.ITEM('s8', intOr(gameProfile.near_setting)),
            judge_delay_offset: K.ITEM('s8', intOr(gameProfile.judge_delay_offset)),
            key_beam_level: K.ITEM('s8', intOr(gameProfile.key_beam_level)),
            orbit_type: K.ITEM('s8', intOr(gameProfile.orbit_type)),
            note_height: K.ITEM('s8', intOr(gameProfile.note_height)),
            note_width: K.ITEM('s8', intOr(gameProfile.note_width)),
            judge_width_type: K.ITEM('s8', intOr(gameProfile.judge_width_type)),
            beat_guide_volume: K.ITEM('s8', intOr(gameProfile.beat_guide_volume)),
            beat_guide_type: K.ITEM('s8', intOr(gameProfile.beat_guide_type)),
            key_volume_offset: K.ITEM('s8', intOr(gameProfile.key_volume_offset)),
            bgm_volume_offset: K.ITEM('s8', intOr(gameProfile.bgm_volume_offset)),
            note_disp_type: K.ITEM('s8', intOr(gameProfile.note_disp_type)),
            slow_fast: K.ITEM('s8', intOr(gameProfile.slow_fast)),
            option_setting: K.ITEM('s32', intOr(gameProfile.option_setting)),
            judge_effect_adjust: K.ITEM('s8', intOr(gameProfile.judge_effect_adjust)),
            simple_bg: K.ITEM('s8', intOr(gameProfile.simple_bg)),
            bingo_index: K.ITEM('s32', intOr(gameProfile.bingo_index)),
            class_basic: K.ITEM('s32', intOr(gameProfile.class_basic)),
            class_recital: K.ITEM('s32', intOr(gameProfile.class_recital)),
            grade_basic: K.ITEM('s32', intOr(gameProfile.grade_basic)),
            grade_recital: K.ITEM('s32', intOr(gameProfile.grade_recital)),
        },
        travel: {
            money: K.ITEM('s32', gameProfile.money),
            pianist_power: K.ITEM('s32', gameProfile.pianist_power),
            fame_index: K.ITEM('s32', gameProfile.fame_index),
            kingdom_id: K.ITEM('s32', gameProfile.kingdom_id),
            quest_index: K.ITEM('s32', gameProfile.quest_index),
        },
        extra_param: {
            param: [
                {
                    '@attr': {type: '1'},
                    count: K.ITEM('s32', gameProfile.param1.length),
                    params_array: (global as any).K.ARRAY('s32', gameProfile.param1),
                },
                {
                    '@attr': {type: '2'},
                    count: K.ITEM('s32', gameProfile.param2.length),
                    params_array: (global as any).K.ARRAY('s32', gameProfile.param2),
                },
            ],
        },
    }, {rootName: 'get_playdata'});
};

export const handlePlayerFinishStage = async (_info: EamuseInfo, data: any, send: EamuseSend) => {
    const root = getRoot(data);
    const refid = root.str('refid', '');
    if(!refid){
        return send.deny();
    }

    const stageList = root.elements('stageinfo.stage');
    const stage = stageList.length > 0 ? stageList[stageList.length - 1] : null;
    const common = stage?.element('common');
    if(!stage || !common){
        return send.deny();
    }

    const music_index = intOr(stage.attr().music_index);
    const sheet_type = intOr(stage.attr().sheet_type);
    const score = common.number('score', 0);
    const clear_flag = common.number('clear_flag', 0);
    const hands_mode = common.number('hands_mode', 0);
    const grade = common.number('grade', 0);

    const entry: any = {
        collection: 'score',
        timestamp: common.number('play_time', 0),
        music_index,
        sheet_type,
        score,
        combo: common.number('combo', 0),
        grade,
        hands_mode,
        play_count: common.number('play_count', 0),
        clear_count: common.number('clear_count', 0),
        multi_count: common.number('multi_count', 0),
        clear_flag,
        slow_count: common.number('slow_count', 0),
        fast_count: common.number('fast_count', 0),
        judge_count_miss: common.number('judge_count.miss', 0),
        judge_count_good: common.number('judge_count.good', 0),
        judge_count_just: common.number('judge_count.just', 0),
        judge_count_super_just: common.number('judge_count.super_just', 0),
        judge_count_near: common.number('judge_count.near', 0),
        judge_percent_max_count_long_miss: common.number('judge_percent_max_count_long.miss', 0),
        judge_percent_max_count_long_good: common.number('judge_percent_max_count_long.good', 0),
        judge_percent_max_count_long_just: common.number('judge_percent_max_count_long.just', 0),
        judge_percent_max_count_long_super_just: common.number(
            'judge_percent_max_count_long.super_just',
            0,
        ),
        judge_percent_max_count_long_near: common.number('judge_percent_max_count_long.near', 0),
        judge_percent_max_count_trill_miss: common.number('judge_percent_max_count_trill.miss', 0),
        judge_percent_max_count_trill_good: common.number('judge_percent_max_count_trill.good', 0),
        judge_percent_max_count_trill_just: common.number('judge_percent_max_count_trill.just', 0),
        judge_percent_max_count_trill_super_just: common.number(
            'judge_percent_max_count_trill.super_just',
            0,
        ),
        judge_percent_max_count_trill_near: common.number('judge_percent_max_count_trill.near', 0),
        note_num_normal: common.number('note_num.normal', 0),
        note_num_long: common.number('note_num.long', 0),
        note_num_glissando: common.number('note_num.glissando', 0),
        note_num_trill: common.number('note_num.trill', 0),
        note_success_rate_normal: common.number('note_success_rate.normal', 0),
        note_success_rate_long: common.number('note_success_rate.long', 0),
        note_success_rate_glissando: common.number('note_success_rate.glissando', 0),
        note_success_rate_trill: common.number('note_success_rate.trill', 0),
        best_score: common.number('best_score', 0),
    };

    await DB.Insert(refid, entry);

    const best: any = await DB.FindOne(refid, {
        collection: 'score_best',
        music_index,
        sheet_type,
    });
    const bestScore = best ? intOr(best.score, score) : score;
    const bestClear = best ? intOr(best.clear_flag, clear_flag) : clear_flag;
    const bestHands = best ? intOr(best.hands_mode, hands_mode) : hands_mode;
    const bestGrade = best ? intOr(best.grade, grade) : grade;

    await DB.Upsert(
        refid,
        {collection: 'score_best', music_index, sheet_type},
        {
            $set: {
                collection: 'score_best',
                music_index,
                sheet_type,
                score: Math.max(score, bestScore),
                play_count: entry.play_count,
                clear_count: entry.clear_count,
                multi_count: entry.multi_count,
                clear_flag: Math.max(clear_flag, bestClear),
                hands_mode: Math.max(hands_mode, bestHands),
                grade: Math.max(grade, bestGrade),
            },
        },
    );

    send.object({
        player: {},
    }, {rootName: 'set_stage_result'});
};

export const handlePlayerFinishGame = async (_info: EamuseInfo, data: any, send: EamuseSend) => {
    const root = getRoot(data);
    const refid = root.str('refid', '');
    if(!refid){
        return send.status(1);
    }

    const profile = await getProfile(refid);
    if(!profile){
        return send.status(1);
    }

    const gameProfile = getGameProfile(profile) || defaultGameProfile('');

    const lastKeys = [
        'music_group',
        'music_index',
        'sheet_type',
        'perform_type',
        'filter_flag',
        'brooch_index',
        'hi_speed_level',
        'beat_guide',
        'headphone_volume',
        'judge_bar_pos',
        'hands_mode',
        'near_setting',
        'judge_delay_offset',
        'key_beam_level',
        'orbit_type',
        'note_height',
        'note_width',
        'judge_width_type',
        'beat_guide_volume',
        'beat_guide_type',
        'key_volume_offset',
        'bgm_volume_offset',
        'note_disp_type',
        'slow_fast',
        'option_setting',
        'judge_effect_adjust',
        'simple_bg',
        'bingo_index',
        'class_basic',
        'class_recital',
        'grade_basic',
        'grade_recital',
    ];
    for(const key of lastKeys){
        gameProfile[key] = root.number(`last.${key}`, 0);
    }

    const travelKeys = ['money', 'pianist_power', 'fame_index', 'kingdom_id', 'quest_index'];
    for(const key of travelKeys){
        gameProfile[key] = root.number(`travel.${key}`, 0);
    }

    for(const param of root.elements('extra_param.param')){
        const type = param.attr().type || '';
        const arr = parseParamValues(param.content('params_array', null));
        if(type === '1' || type === '2'){
            gameProfile[`param${type}`] = arr;
        }
    }

    const {__refid, ...cleanProfile} = profile as any;
    delete cleanProfile.versions;
    await DB.Upsert(
        refid,
        {collection: 'profile'},
        {$set: {...cleanProfile, profile: gameProfile}, $unset: {versions: true}},
    );

    send.object({
        player: {},
    }, {rootName: 'set_total_result'});
};
