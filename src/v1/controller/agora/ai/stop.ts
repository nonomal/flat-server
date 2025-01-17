import { FastifySchema, Response, ResponseError } from "../../../../types/Server";
import { ax } from "../../../utils/Axios";
import { AbstractController } from "../../../../abstract/controller";
import { Controller } from "../../../../decorator/Controller";
import { AI_SERVER_URL_CN, AI_SERVER_URL_EN } from "./const";
import { Status } from "../../../../constants/Project";

@Controller<RequestType, any>({
    method: "post",
    path: "agora/ai/stop",
    auth: true,
})
export class AgoraAIStop extends AbstractController<RequestType, any> {
    public static readonly schema: FastifySchema<RequestType> = {
        body: {
            type: "object",
            required: ["request_id", "channel_name", "language"],
            properties: {
                request_id: {
                    type: "string",
                },
                channel_name: {
                    type: "string",
                },
                language: {
                    type: "string",
                }
            },
        },
    };

    public async execute(): Promise<Response<any>> {
        const { request_id, channel_name, language  } = this.body;
        const api = language === "zh" ? AI_SERVER_URL_CN : AI_SERVER_URL_EN;
        const res = await ax.post<any>(`${api}/start`, {
                request_id, 
                channel_name,
            }, 
            {    
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
        return {
            status: Status.Success,
            data: res.data,
        }
    }

    public errorHandler(error: Error): ResponseError {
        return this.autoHandlerError(error);
    }
}

interface RequestType {
    body: {
        request_id: string;
        channel_name: string;
        language: string;
    };
}
