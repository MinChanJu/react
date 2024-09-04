import React from "react";
import { User } from "../model/talbe";

interface SettingViewProps {
  user: User
}

const SettingView:React.FC<SettingViewProps> = ({user}) => {
  return (
    <div>설정</div>
  )
}

export default SettingView