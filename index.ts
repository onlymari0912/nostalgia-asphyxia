import { handleCommonInfo, handleMusicInfo } from './handlers/common';
import {
    handlePlayerMusicData,
    handlePlayerPlayData,
    handlePlayerRegister,
    handlePlayerFinishStage,
    handlePlayerFinishGame,
} from './handlers/player';

export function register() {
    R.GameCode('PAN');
    R.Contributor('onlymari0912');

    R.Route('op3_common.get_common_info', handleCommonInfo);
    R.Route('op3_common.get_music_info', handleMusicInfo);

    R.Route('op3_player.regist_playdata', handlePlayerRegister);
    R.Route('op3_player.get_musicdata', handlePlayerMusicData);
    R.Route('op3_player.get_playdata', handlePlayerPlayData);
    R.Route('op3_player.set_stage_result', handlePlayerFinishStage);
    R.Route('op3_player.set_total_result', handlePlayerFinishGame);
}
