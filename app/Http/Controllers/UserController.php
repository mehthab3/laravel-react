<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        return User::with('roles')->orderBy('name')->get();
    }

    public function store(Request $request)
    {
        // $request->validate([
        //     'name'=>'required',
        //     'email'=>'required|exists:users,email', //exists:users,email
        //     'roles'=>'required'
        // ]);

        try{
            $inputData = [];
            $inputData['name'] = $request->get('name');
            $inputData['email'] = $request->get('email');
            $roles = $request->get('roles');
            
            $user = User::create($inputData);
            foreach($roles as $role){
                $roleUser = ['user_id'=>$user->id,'role_id'=>$role];
                Role::create($roleUser);
            }
            
            return response()->json([
                'message'=>'User Created Successfully!!'
            ]);
        }catch(\Exception $e){
            \Log::error($e->getMessage());
            return response()->json([
                'message'=>'Something goes wrong while creating a user!!'
            ],500);
        }
    }

    public function roles()
    {
        return Role::all();
    }
}
