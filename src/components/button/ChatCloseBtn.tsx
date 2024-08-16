'use client';
import { exitRoom } from '@/service/chat/actions';
import { handleError } from '@/service/utils/error';
import { useCountMemberStore } from '@/store/chat/store';
import CloseIcon from '@mui/icons-material/Close';
import { useSearchParams, usePathname, useRouter } from "next/navigation";


const ChatCloseBtn = ({roomId}:{roomId:string}) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const {numberOfMember,setNumberOfMember}=useCountMemberStore();
    
    const handleClose = async() => {
        const params = new URLSearchParams(searchParams);
        const response=await exitRoom(params.get('roomId')||'');
        
        handleError(response.message);
        // const memberCountList=numberOfMember.filter((mem)=>mem.roomId===roomId).map((mem)=>mem.count);
        
        // if(memberCountList.length!==0){
        //     console.log('memberCountList: ',memberCountList.length-1);
        //     setNumberOfMember(roomId,memberCountList.length-1);
        // }
        params.delete('roomId');
        router.push(`${pathname}?${params.toString()}`);
    }

    return (<>
        <button
            onClick={handleClose}
            className=' flex justify-start hover:bg-blue-50 rounded-full p-2'
        >
            <CloseIcon className='' />
        </button>
    </>);
}
export default ChatCloseBtn;