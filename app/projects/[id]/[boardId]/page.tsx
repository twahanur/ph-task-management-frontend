import BoardDetails from "@/components/pages/shared/boards/BoardDetails";
import { getBoardById } from "@/service/boardService/board.service";

export default async function page({
    params,
}: {
    params: Promise<{ id: string, boardId: string }>;
}) {
    const {id, boardId } = await params
    const board = await getBoardById(boardId)
    return (
        <div>
            <BoardDetails board={board?.data || {}} projectId={id} />
        </div>
    )
}