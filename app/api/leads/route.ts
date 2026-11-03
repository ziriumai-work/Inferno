import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // BUG-01: Protect endpoint - require authenticated user session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access. Authentication required." },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "inferno_leads")
      .maybeSingle();

    if (error) {
      console.error("Error fetching leads from Supabase:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    let leads = [];
    if (data?.value) {
      try {
        leads = typeof data.value === "string" ? JSON.parse(data.value) : data.value;
      } catch {
        leads = [];
      }
    }

    return NextResponse.json({ success: true, leads, count: Array.isArray(leads) ? leads.length : 0 });
  } catch (err: any) {
    console.error("API /api/leads GET unexpected exception:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to load leads" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // BUG-03: Empty or invalid payload rejection
    if (!body || typeof body !== "object" || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, error: "Empty or invalid lead payload." },
        { status: 400 }
      );
    }

    const email = (body.email || body.contactEmail || "").trim();
    const name = (body.name || body.contactName || "").trim();
    const phone = (body.phone || "").trim();
    const uei = (body.uei || "").trim();
    const naics = (body.naics || "").trim();

    // Required fields check
    if (!email || !name) {
      return NextResponse.json(
        { success: false, error: "Name and a valid email address are required." },
        { status: 400 }
      );
    }

    // BUG-05: Strict Email Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // BUG-05: Phone format validation (if provided)
    if (phone) {
      const phoneDigits = phone.replace(/[\s\-\(\)\+\.]/g, "");
      if (!/^\d{7,15}$/.test(phoneDigits)) {
        return NextResponse.json(
          { success: false, error: "Please provide a valid telephone number." },
          { status: 400 }
        );
      }
    }

    // BUG-05: UEI format validation (if provided: 12 alphanumeric, or 5-char CAGE)
    if (uei && !/^[A-Za-z0-9]{12}$/.test(uei) && !/^[A-Za-z0-9]{5}$/.test(uei)) {
      return NextResponse.json(
        { success: false, error: "UEI must be 12 alphanumeric characters (or 5-character CAGE)." },
        { status: 400 }
      );
    }

    // BUG-05: NAICS format validation (if provided: 6 digits)
    if (naics && !/^\d{6}$/.test(naics)) {
      return NextResponse.json(
        { success: false, error: "Primary NAICS code must be 6 digits." },
        { status: 400 }
      );
    }

    // Server-enforced lead structure: client cannot forge id, status, adminNotes, or createdAt
    const newLead = {
      id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: body.type || "contact",
      name,
      contactName: name,
      email,
      contactEmail: email,
      phone,
      company: (body.company || body.org || body.partnerCompany || "").trim(),
      partnerCompany: (body.partnerCompany || body.company || "").trim(),
      org: (body.org || body.company || "").trim(),
      service: body.service || "",
      message: body.message || body.notes || "",
      notes: body.notes || body.message || "",
      uei,
      naics,
      jobId: body.jobId,
      jobTitle: body.jobTitle,
      cover: body.cover,
      resumeName: body.resumeName,
      resumeData: body.resumeData,
      solicitation: body.solicitation,
      contractTitle: body.contractTitle,
      agency: body.agency,
      teamingRole: body.teamingRole,
      partnerType: body.partnerType,
      certStatus: body.certStatus,
      bondingCapacity: body.bondingCapacity,
      consultType: body.consultType,
      timezone: body.timezone,
      date: body.date,
      time: body.time,
      answers: body.answers,
      recommendations: body.recommendations,
      resourceId: body.resourceId,
      resourceTitle: body.resourceTitle,
      applicationDetails: body.applicationDetails,
      workAuthorization: body.workAuthorization || body.applicationDetails?.workAuthorization,
      securityClearance: body.securityClearance || body.applicationDetails?.securityClearance,
      yearsExperience: body.yearsExperience || body.applicationDetails?.yearsExperience,
      educationLevel: body.educationLevel || body.applicationDetails?.educationLevel,
      certifications: body.certifications || body.applicationDetails?.certifications,
      willingToTravel: body.willingToTravel || body.applicationDetails?.willingToTravel,
      earliestStartDate: body.earliestStartDate || body.applicationDetails?.earliestStartDate,
      desiredCompensation: body.desiredCompensation || body.applicationDetails?.desiredCompensation,
      digitalSignature: body.digitalSignature || body.applicationDetails?.digitalSignature,
      attestationConfirmed: body.attestationConfirmed ?? body.applicationDetails?.attestationConfirmed,
      cityStateZip: body.cityStateZip || body.applicationDetails?.cityStateZip,
      linkedinUrl: body.linkedinUrl || body.applicationDetails?.linkedinUrl,
      status: "new",
      adminNotes: "",
      createdAt: new Date().toISOString(),
    };

    // 1. Fetch current leads
    const { data: currentData, error: fetchErr } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "inferno_leads")
      .maybeSingle();

    if (fetchErr) {
      console.warn("Could not retrieve current leads from Supabase, initializing list:", fetchErr);
    }

    let currentLeads: any[] = [];
    if (currentData?.value) {
      try {
        currentLeads = typeof currentData.value === "string" ? JSON.parse(currentData.value) : currentData.value;
      } catch {
        currentLeads = [];
      }
    }
    if (!Array.isArray(currentLeads)) currentLeads = [];

    // 2. Prepend new lead and persist
    const updatedLeads = [newLead, ...currentLeads.filter((l) => l.id !== newLead.id)];

    const { error: saveErr } = await supabase.from("settings").upsert({
      key: "inferno_leads",
      value: JSON.stringify(updatedLeads),
    });

    if (saveErr) {
      console.error("Error saving lead into Supabase:", saveErr);
      return NextResponse.json({ success: false, error: saveErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, lead: newLead, totalCount: updatedLeads.length });
  } catch (err: any) {
    console.error("API /api/leads POST unexpected exception:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to submit lead" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Authenticated admin required to update lead status/notes
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access. Authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, status, adminNotes } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing lead id." }, { status: 400 });
    }

    const { data: currentData, error: fetchErr } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "inferno_leads")
      .maybeSingle();

    if (fetchErr || !currentData?.value) {
      return NextResponse.json({ success: false, error: "Leads store not found." }, { status: 404 });
    }

    let currentLeads: any[] = [];
    try {
      currentLeads = typeof currentData.value === "string" ? JSON.parse(currentData.value) : currentData.value;
    } catch {
      currentLeads = [];
    }

    const updatedLeads = currentLeads.map((l) => {
      if (l.id === id) {
        return {
          ...l,
          ...(status !== undefined ? { status } : {}),
          ...(adminNotes !== undefined ? { adminNotes } : {}),
        };
      }
      return l;
    });

    const { error: saveErr } = await supabase.from("settings").upsert({
      key: "inferno_leads",
      value: JSON.stringify(updatedLeads),
    });

    if (saveErr) {
      return NextResponse.json({ success: false, error: saveErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Authenticated admin required to delete lead records
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access. Authentication required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing lead id parameter." }, { status: 400 });
    }

    const { data: currentData } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "inferno_leads")
      .maybeSingle();

    let currentLeads: any[] = [];
    if (currentData?.value) {
      try {
        currentLeads = typeof currentData.value === "string" ? JSON.parse(currentData.value) : currentData.value;
      } catch {
        currentLeads = [];
      }
    }

    const updatedLeads = currentLeads.filter((l) => l.id !== id);

    const { error: saveErr } = await supabase.from("settings").upsert({
      key: "inferno_leads",
      value: JSON.stringify(updatedLeads),
    });

    if (saveErr) {
      return NextResponse.json({ success: false, error: saveErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

