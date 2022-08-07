<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;

    protected $fillable = ['full_name', 'email'];

    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

}
