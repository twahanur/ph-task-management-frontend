import { useState } from "react";
import { UserPlus, X, CheckSquare } from "lucide-react";

interface BoardUser {
    name: string;
    avatar_url?: string | null;
    email?: string | null;
}

interface BoardMember {
    user_id: string;
    user: BoardUser;
}

interface CardMember {
    id: string;
    user_id: string;
}

interface CardMembersPopoverProps {
    boardMembers: BoardMember[];
    cardMembers: CardMember[];
    onAssignMember: (userId: string) => Promise<void>;
}

export default function CardMembersPopover({
    boardMembers,
    cardMembers,
    onAssignMember
}: CardMembersPopoverProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleMemberClick = async (userId: string) => {
        await onAssignMember(userId);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 silver-btn px-3 py-1.5 rounded text-sm transition cursor-pointer"
            >
                <UserPlus size={16} /> Members
            </button>
            
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 silver-metallic border border-gray-300 rounded-xl shadow-xl z-20 py-2">
                    <div className="px-3 pb-2 mb-2 border-b border-gray-200 flex justify-between items-center">
                        <h4 className="text-sm font-semibold text-gray-700">Members</h4>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={14} /></button>
                    </div>
                    <div className="max-h-64 overflow-y-auto custom-scrollbar px-2 space-y-1">
                        {boardMembers?.map((member) => {
                            const isAssigned = cardMembers?.some(
                                (m: any) => m.id === member.user_id || m.user_id === member.user_id
                            );

                            return (
                                <button 
                                    key={member.user_id}
                                    onClick={() => handleMemberClick(member.user_id)}
                                    className="w-full flex items-center gap-3 text-left text-sm text-gray-800 hover:bg-gray-200/50 p-2 rounded transition cursor-pointer"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-800 overflow-hidden flex-shrink-0">
                                        {member.user.avatar_url ? (
                                            <img src={member.user.avatar_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            member.user.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <span className="truncate">{member.user.name}</span>
                                    {isAssigned && (
                                        <CheckSquare size={14} className="ml-auto text-gray-600 flex-shrink-0" />
                                    )}
                                </button>
                            );
                        })}
                        {(!boardMembers || boardMembers.length === 0) && (
                            <p className="text-gray-500 text-xs px-2 py-1">No members found on this board.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
