
import React from 'react';
import { User } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRound, Briefcase } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ColleaguesListProps {
  users: User[];
  organization: string;
}

const ColleaguesList = ({ users, organization }: ColleaguesListProps) => {
  // Filter out the demo user with email demo@example.com
  const filteredUsers = users.filter(user => user.email !== 'demo@example.com');
  
  if (filteredUsers.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p>No one else from {organization} has registered yet.</p>
        <p className="text-sm mt-2">Invite your classmates to join!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">People from {organization}</h3>
        <span className="text-sm text-gray-500">{filteredUsers.length} users</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={user.profileImage} />
                  <AvatarFallback className="bg-codegen-purple/10 text-codegen-purple text-lg">
                    {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h4 className="font-medium">{user.fullName}</h4>
                  <div className="flex items-center text-sm text-gray-500">
                    {user.userType === 'student' ? (
                      <UserRound className="h-3 w-3 mr-1" />
                    ) : (
                      <Briefcase className="h-3 w-3 mr-1" />
                    )}
                    {user.userType === 'student' ? 'Student' : 'Professional'}
                  </div>
                  <p className="text-xs text-gray-400">@{user.username}</p>
                </div>
                
                <div className="ml-auto text-right">
                  <div className="text-sm">
                    <span className="font-medium">{user.problemsSolved}</span> problems
                  </div>
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">{user.points}</span> points
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ColleaguesList;
