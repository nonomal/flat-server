import test from "ava";
import { orm } from "../../../../thirdPartyService/TypeORMService";
import { Connection } from "typeorm";
import { UserDAO } from "../../../../dao";
import { Gender } from "../../../../constants/Project";
import { v4 } from "uuid";
import { ServiceUser } from "../User";
import { ControllerError } from "../../../../error/ControllerError";
import { ErrorCode } from "../../../../ErrorCode";

const namespace = "[service][service-user]";

let connection: Connection;
test.before(`${namespace} - connection orm`, async () => {
    connection = await orm();
});

test.after(`${namespace} - close orm`, async () => {
    await connection.close();
});

test(`${namespace} - has name and avatar`, async ava => {
    const [userUUID, userName, avatarURL] = [v4(), `test_name_${v4()}`, `https://test.com/${v4()}`];

    await UserDAO().insert({
        user_name: userName,
        avatar_url: avatarURL,
        gender: Gender.None,
        user_uuid: userUUID,
        user_password: "",
    });

    const serviceUser = new ServiceUser(userUUID);

    const result = await serviceUser.nameAndAvatar();

    if (result === null) {
        return ava.fail("serviceUser.nameAndAvatar must has value");
    }

    ava.is(result.userName, userName);
    ava.is(result.avatarURL, avatarURL);
});

test(`${namespace} - no found name and avatar`, async ava => {
    const serviceUser = new ServiceUser(v4());

    const result = await serviceUser.nameAndAvatar();

    ava.is(result, null);
});

test(`${namespace} - assert has name and avatar`, async ava => {
    const [userUUID, userName, avatarURL] = [v4(), `test_name_${v4()}`, `https://test.com/${v4()}`];

    await UserDAO().insert({
        user_name: userName,
        avatar_url: avatarURL,
        gender: Gender.None,
        user_uuid: userUUID,
        user_password: "",
    });

    const serviceUser = new ServiceUser(userUUID);

    await ava.notThrowsAsync(serviceUser.assertGetNameAndAvatar());

    ava.deepEqual(await serviceUser.assertGetNameAndAvatar(), {
        userName: userName,
        avatarURL: avatarURL,
    });
});

test(`${namespace} - assert has name and avatar failed`, async ava => {
    const serviceUser = new ServiceUser(v4());

    const rawError = await ava.throwsAsync<ControllerError>(serviceUser.assertGetNameAndAvatar());

    ava.is(rawError.errorCode, ErrorCode.UserNotFound);
});