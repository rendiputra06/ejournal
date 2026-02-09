<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class EmailTemplateController extends Controller
{
    public function index()
    {
        $templates = \App\Models\EmailTemplate::all();
        return \Inertia\Inertia::render('EmailTemplates/Index', [
            'templates' => $templates
        ]);
    }

    public function edit(\App\Models\EmailTemplate $emailTemplate)
    {
        return \Inertia\Inertia::render('EmailTemplates/Form', [
            'template' => $emailTemplate
        ]);
    }

    public function update(Request $request, \App\Models\EmailTemplate $emailTemplate)
    {
        $data = $request->validate([
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $emailTemplate->update($data);

        return redirect()->route('email-templates.index')->with('success', 'Email template updated successfully.');
    }
}
